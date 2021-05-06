import { ICommandInfoV2 } from "../controller/command"
import { VectorInteraction } from "../controller/interactions/VectorInteraction"
import { change_selected_actors, change_selected_brushes } from "../model/algorithms/editor_state_change"
import { BrushVertex } from "../model/BrushVertex"
import { get_world_to_actor_rotation_scaling } from "../model/geometry/actor-space-transform"
import { get_brush_polygon_vertex_uvs, set_brush_polygon_vertex_uvs } from "../model/uvmap/vertex_uv"
import { Vector } from "../model/Vector"

export const move_command: ICommandInfoV2 = {
    description: 'Move objects or vertexes',
    shortcut: 'g',
    args: [
        {
            interaction_factory: VectorInteraction.factory,
            example_values: [ Vector.FORWARD, Vector.RIGHT, Vector.UP ]
        }
    ],
    exec: (state, motion: Vector) => state.options.vertex_mode 
        ? change_selected_brushes(state, (b,a) => {
            const matrix = get_world_to_actor_rotation_scaling(a)
            const vertex_motion = matrix.apply(motion)
            let new_brush = b.shallow_copy()
            new_brush.vertexes = new_brush.vertexes.map(v => !v.selected ? v 
                : new BrushVertex(v.position.add_vector(vertex_motion), true))
            if (state.options.preserve_vertex_uv){
                for (let i=0; i<b.polygons.length; i++){
                    const uvs = get_brush_polygon_vertex_uvs(b,i)
                    new_brush = set_brush_polygon_vertex_uvs(new_brush,i,uvs)
                }
            }
            return new_brush
        })
        : change_selected_actors(state, a => {
            const new_obj = a.shallow_copy()
            new_obj.location = a.location.add_vector(motion)
            return new_obj
        })
}