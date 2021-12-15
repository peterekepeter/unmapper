import { ICommandInfoV2 } from "../controller/command"
import { BoundingBox } from "../model/BoundingBox"
import { BrushVertex } from "../model/BrushVertex"
import { EditorState } from "../model/EditorState"
import { nearest_power_of_two, round_to_precision } from "../model/ExtendedMath"
import { get_actor_to_world_transform_simple } from "../model/geometry/actor-space-transform"
import { RandomVectorGenerator } from "../model/random/RandomVectorGenerator"
import { change_selected_actors } from "../model/state"
import { Vector } from "../model/Vector"

export const recalculate_brush_center_command: ICommandInfoV2 = {
    description: 'Recalculate brush center',
    exec: recalculate_brush_center,
}

function recalculate_brush_center(state: EditorState): EditorState {
    const generator = new RandomVectorGenerator()
    generator.seed = Date.now()
    BoundingBox.from_vectors
    return change_selected_actors(
        state, 
        a => {
            const b = a.brushModel
            if (!b){
                return a // no change
            }
            let sum_x=0, sum_y = 0, sum_z = 0
            let min_x = Infinity, min_y = Infinity, min_z = Infinity
            let max_x = -Infinity, max_y = -Infinity, max_z = -Infinity
            for (const vertex of b.vertexes){
                const p = vertex.position
                sum_x += p.x
                sum_y += p.y
                sum_z += p.z
                min_x = Math.min(min_x, p.x)
                min_y = Math.min(min_y, p.y)
                min_z = Math.min(min_z, p.z)
                max_x = Math.max(max_x, p.x)
                max_y = Math.max(max_y, p.y)
                max_z = Math.max(max_z, p.z)
            }
            const mean_x = sum_x / b.vertexes.length
            const mean_y = sum_y / b.vertexes.length
            const mean_z = sum_z / b.vertexes.length
            const size_x = max_x - min_x
            const size_y = max_y - min_y
            const size_z = max_z - min_z
            const magnitude_x = nearest_power_of_two(size_x)
            const magnitude_y = nearest_power_of_two(size_y)
            const magnitude_z = nearest_power_of_two(size_z)
            
            // align to a more stable center
            const center_x = round_to_precision(mean_x, magnitude_x / 16.0)
            const center_y = round_to_precision(mean_y, magnitude_y / 16.0)
            const center_z = round_to_precision(mean_z, magnitude_z / 16.0)
            
            const new_center  = new Vector(center_x, center_y, center_z)
            const new_vertexes = b.vertexes.map(v => new BrushVertex(v.position.subtract_vector(new_center)))
            const new_polygons = b.polygons.map(p => {
                const new_p = p.shallow_copy()
                new_p.origin = new_p.origin.subtract_vector(new_center)
                return new_p
            })
            
            const new_brush = b.shallow_copy()
            new_brush.vertexes = new_vertexes
            new_brush.polygons = new_polygons
            const new_actor = a.shallow_copy()
            new_actor.brushModel = new_brush

            // adjust transform location so vertexes end up in same world coordinates
            const old_transform = get_actor_to_world_transform_simple(a)
            const old_world_vertex_position = old_transform(b.vertexes[0].position)
            const new_world_vertex_position = old_transform(new_brush.vertexes[0].position)

            new_actor.location = a.location.add_vector(old_world_vertex_position.subtract_vector(new_world_vertex_position))
            return new_actor
        },
    )
}
