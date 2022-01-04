import { ICommandInfoV2 } from "../controller/command"
import { align_to_grid } from "../model/algorithms/alignToGrid"
import { calculate_polygon_center } from "../model/algorithms/calculate_polygon_median"
import { calculate_polygon_normal } from "../model/algorithms/calculate_polygon_normal"
import { BrushVertex } from "../model/BrushVertex"
import { EditorState } from "../model/EditorState"
import { get_world_to_actor_transform } from "../model/geometry/actor-space-transform"
import { GeometryCache } from "../model/geometry/GeometryCache"
import { change_selected_brushes } from "../model/state"
import { Vector } from "../model/Vector"


export function get_align_vertexes_to_world_grid_commands(): ICommandInfoV2[] {
    return [1, 2, 4, 8, 16, 32].map(create_align_command)
}

function create_align_command(grid_size: number): ICommandInfoV2{
    return {
        exec: state => align_vertexes_to_world_grid(state, grid_size),
        description: `Align Mesh Vertexes to ${grid_size}x${grid_size}x${grid_size} world grid`,
    }
}

function align_vertexes_to_world_grid(state: EditorState, size: number): EditorState {
    const grid = new Vector(size, size, size)
    const geometry = new GeometryCache()
    geometry.actors = state.map.actors
    
    return change_selected_brushes(state, (b, a, as) => { 
        let vertexes = geometry.get_world_transformed_vertexes(as.actor_index)
        if (state.options.vertex_mode) {
            for (const vertex_index of as.vertexes){
                vertexes[vertex_index] = align_to_grid(vertexes[vertex_index], grid)
            }
        } else {
            vertexes = vertexes.map(v => align_to_grid(v, grid))
        }
        const to_model_fn = get_world_to_actor_transform(a)
        const new_brush = b.shallow_copy()
        new_brush.vertexes = vertexes.map(v => new BrushVertex(to_model_fn(v)))

        // update polygon normal and center
        new_brush.polygons = new_brush.polygons.map(p => {
            const new_poly = p.shallow_copy()
            new_poly.normal = calculate_polygon_normal(new_brush.vertexes, new_poly)
            new_poly.median = calculate_polygon_center(new_brush.vertexes, new_poly)
            return new_poly
        })
        return new_brush
    })
}
