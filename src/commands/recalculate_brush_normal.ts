import { ICommandInfoV2 } from "../controller/command"
import { calculate_polygon_normal } from "../model/algorithms/calculate_polygon_normal"
import { BrushEdge } from "../model/BrushEdge"
import { BrushPolygon } from "../model/BrushPolygon"
import { BrushVertex } from "../model/BrushVertex"
import { EditorState } from "../model/EditorState"
import { change_selected_brushes } from "../model/state"

export const recalculate_brush_normal_command: ICommandInfoV2 = {
    description: 'Recalculate brush normal',
    shortcut: 'alt + n',
    exec: recalculate_brush_normal,
}

function recalculate_brush_normal(state: EditorState): EditorState {
    return change_selected_brushes(state, (input_brush) => {
        const input_polygons = input_brush.polygons
        const marked_poly = new Set<number>()
        const queue: { from: number, to: number, edge: BrushEdge }[] = []
        const result_brush = input_brush.shallow_copy()
        const result_polygons = [...input_brush.polygons]
        result_brush.polygons = result_polygons
      
        while (marked_poly.size < input_brush.polygons.length)
        {
            // pick starting polygon
            for (let index = 0; index < input_polygons.length; index++){
                if (!marked_poly.has(index)){
                    marked_poly.add(index)
                    add_neighbors(index)
                    break
                }
            }
            // fill neighbors
            while (queue.length > 0){
                const queue_item = queue.pop()
                add_neighbors(queue_item.to)
                result_polygons[queue_item.to] = transfer_winding(queue_item)
            }
        }
        
        // recalculate individual normals
        for (let i=0; i<result_polygons.length; i++){
            result_polygons[i] = calculate_normal(input_brush.vertexes, result_polygons[i])
        }

        let changed = false
        for (let i=0; i<result_polygons.length; i++){
            if (result_polygons[i] !== input_polygons[i]){
                changed = true
                break
            }
        }

        if (!changed){
            // no polygons changed, return unchanged input
            return input_brush
        }
        
        return result_brush

        function add_neighbors(polygon_index: number){    
            const polygon = input_brush.polygons[polygon_index]        
            for (const edge_index of polygon.edges){
                const edge = input_brush.edges[edge_index]
                for (const neighbor_polygon_index of edge.polygons){
                    if (marked_poly.has(neighbor_polygon_index)){
                        continue
                    }
                    queue.push({ 
                        from: polygon_index, 
                        to: neighbor_polygon_index, 
                        edge,
                    })
                    marked_poly.add(neighbor_polygon_index)
                }
            }
    
        }
        
        function transfer_winding(task: { from: number; to: number; edge: BrushEdge }): BrushPolygon {
            const { from, to, edge } = task
            const vertex_a = edge.vertexIndexA
            const vertex_b = edge.vertexIndexB
            const from_polygon_has = has_vertex_sequence(result_polygons[from], vertex_a, vertex_b)
            const to_polygon_has = has_vertex_sequence(result_polygons[to], vertex_a, vertex_b)
            if (from_polygon_has !== to_polygon_has){
                // winding okay
                return result_polygons[to]
            }
            else { 
                const new_polygon = result_polygons[to].shallow_copy()
                const new_vertex_list = [...new_polygon.vertexes]
                new_vertex_list.reverse()
                new_polygon.vertexes = new_vertex_list
                return new_polygon
            }
        }
    })
}

function has_vertex_sequence(from_polygon: BrushPolygon, vertex_a: number, vertex_b: number) {
    let last = from_polygon.vertexes[from_polygon.vertexes.length - 1]
    for (const current of from_polygon.vertexes){
        if (vertex_a === last && vertex_b === current){
            return true
        }
        last = current
    }
    return false
}

function calculate_normal(vertexes: BrushVertex[], polygon: BrushPolygon): BrushPolygon {
    const normal = calculate_polygon_normal(vertexes, polygon)
    if (normal.equals(polygon.normal)){
        return polygon
    }
    const new_polygon = polygon.shallow_copy()
    new_polygon.normal = normal
    return new_polygon
}
