import { ICommandInfoV2 } from "../controller/command"
import { ClippingPlaneInteraction } from "../controller/interactions/stateful/ClippingPlaneInteraction"
import { Actor } from "../model/Actor"
import { createBrushPolygon } from "../model/algorithms/createBrushPolygon"
import { deleteBrushData } from "../model/algorithms/deleteBrushData"
import { BrushModel } from "../model/BrushModel"
import { BrushPolygon } from "../model/BrushPolygon"
import { BrushVertex } from "../model/BrushVertex"
import { EditorState } from "../model/EditorState"
import { get_world_to_actor_rotation_scaling, get_world_to_actor_transform_simple } from "../model/geometry/actor-space-transform"
import { Plane } from "../model/Plane"
import { change_selected_brushes } from "../model/state"
import { Vector } from "../model/Vector"

export const clip_geometry_command: ICommandInfoV2 = {
    description: "Clip geometry",
    shortcut: "c",
    exec: exec_clip_geometry,
    args: [
        {
            name: 'Clipping plane',
            example_values: [Plane.XY, Plane.YZ, Plane.XZ],
            interaction_factory: ClippingPlaneInteraction.factory,
        },
    ],
}

function exec_clip_geometry(state: EditorState, world_plane: Plane): EditorState {
    if (!world_plane) {
        return state
    }
    return clip_geometry(state, world_plane)
}

function clip_geometry(state: EditorState, world_plane: Plane): EditorState {
    return change_selected_brushes(state, (brush, object, selection) => {

        const object_plane = world_plane_to_object_plane(world_plane, object)
        const is_clipped_vert = prepare_vertex_clip_array(brush, object_plane)
        const vertexes_to_delete = is_clipped_vert.reduce((arr, current, index) => current ? (arr.push(index), arr) : arr, [])
        if (vertexes_to_delete.length === 0) {
            return brush // all on same side
        }

        const next_brush = brush.shallow_copy()
        next_brush.vertexes = next_brush.vertexes.map((v, i) => selection.vertexes.indexOf(i) !== -1 ? new BrushVertex(v.position) : v)
        next_brush.edges = [...next_brush.edges]
        next_brush.polygons = [...next_brush.polygons]
        const result_polygons: BrushPolygon[] = []
        const [intersections, intersection_on_edge] = get_edge_intersection_points(brush, object_plane, is_clipped_vert)
        const new_vertexes = intersections.map(p => next_brush.addVertex(p))
        
        for (let i = 0; i < brush.polygons.length; i++) {
            const poly = brush.polygons[i]

            // handle simple cases
            {
                const clipped_vertex_count = poly.vertexes.reduce((prev, poly_vertex_index) => is_clipped_vert[poly_vertex_index] ? prev + 1 : prev, 0)
    
                if (clipped_vertex_count === 0) {
                    result_polygons.push(poly)
                    continue // poly needs no clipping
                }
                if (clipped_vertex_count === poly.vertexes.length) {
                    continue // poly is fully clipped
                }
            }

            // poly needs clipping
            const new_poly_vertex_list: number[] = []
            for (let i = 0; i < poly.vertexes.length; i++) {

                const vertex_index = poly.vertexes[i]
                if (!is_clipped_vert[vertex_index]){
                    // not clipped vertex
                    new_poly_vertex_list.push(vertex_index)
                }

                const next_vertex = poly.vertexes[(i + 1) % poly.vertexes.length]
                if (is_clipped_vert[vertex_index] !== is_clipped_vert[next_vertex]){
                    // new vertex
                    const intersection_index = intersection_on_edge.findIndex(edge_index => {
                        const edge = brush.edges[edge_index]
                        return edge.vertexIndexA === vertex_index && edge.vertexIndexB === next_vertex
                            || edge.vertexIndexB === vertex_index && edge.vertexIndexA === next_vertex
                    })
                    if (intersection_index === -1){
                        throw new Error('intersection not found')
                    }
                    const new_vertex_index = new_vertexes[intersection_index]
                    new_poly_vertex_list.push(new_vertex_index)
                }
            }
            const clipped_poly = poly.shallow_copy()
            clipped_poly.vertexes = new_poly_vertex_list
            result_polygons.push(clipped_poly)
        }
        next_brush.polygons = result_polygons
        
        const cleaned = new_vertexes.length >= 3 
            ? createBrushPolygon(next_brush, new_vertexes)
            : next_brush
        
        cleaned.polygons = cleaned.polygons.map(p => p.shallow_copy())
        cleaned.rebuild_all_poly_edges()
        return deleteBrushData(cleaned, { vertexes: vertexes_to_delete })
    })
}

function world_plane_to_object_plane(world_plane: Plane, object: Actor): Plane {
    const world_to_object = get_world_to_actor_rotation_scaling(object)
    const world_to_object_fn = get_world_to_actor_transform_simple(object)
    const new_normal = world_to_object.apply(world_plane.normal)
    const world_plane_center: Vector = world_plane.get_center_position()
    const new_location = world_to_object_fn(world_plane_center)
    return new Plane(new_normal, new_location)
}

function prepare_vertex_clip_array(brush: BrushModel, object_plane: Plane): boolean[] {
    return brush.vertexes.map(v => object_plane.is_in_front_of_point(v.position))
}

function get_edge_intersection_points(brush: BrushModel, object_plane: Plane, is_clipped_vert: boolean[]): [Vector[], number[]] {

    const new_vertexes: Vector[] = []
    const new_vertex_on_edge: number[] = []
    for (let i = 0; i < brush.edges.length; i++) {
        const edge = brush.edges[i]
        if (is_clipped_vert[edge.vertexIndexA] !== is_clipped_vert[edge.vertexIndexB]) {
            const position_a = brush.vertexes[edge.vertexIndexA].position
            const position_b = brush.vertexes[edge.vertexIndexB].position
            const intersection = object_plane.intersect_segment(position_a, position_b)
            if (intersection == null) {
                throw new Error("no intersection")
            }
            new_vertexes.push(intersection)
            new_vertex_on_edge.push(i)
        }
    }
    return [new_vertexes, new_vertex_on_edge]
}
