import { ICommandInfoV2 } from "../controller/command"
import { InteractionType } from "../controller/interactions/InteractionType"
import { change_selected_actors, change_selected_brushes, change_selected_vertexes } from "../model/algorithms/editor_state_change"
import { BrushVertex } from "../model/BrushVertex"
import { Vector } from "../model/Vector"

export const move_command: ICommandInfoV2 = {
    description: 'Move objects or vertexes',
    shortcut: 'g',
    args: [
        {
            interaction_type: InteractionType.VectorInput,
            example_values: [ Vector.FORWARD, Vector.RIGHT, Vector.UP ]
        }
    ],
    exec: (state, motion: Vector) => state.vertex_mode 
        ? change_selected_vertexes(state, v => new BrushVertex(
            v.position.addVector(motion), 
            v.selected))
        : change_selected_actors(state, a => {
            const new_obj = a.shallow_copy()
            new_obj.location = a.location.addVector(motion)
            return new_obj
        })
}