import { ICommandInfoV2 } from "../controller/command"
import { InteractionType } from "../controller/interactions/InteractionType"
import { change_selected_actors, change_selected_brushes } from "../model/algorithms/editor_state_change"
import { BrushVertex } from "../model/BrushVertex"
import { get_actor_to_world_transform, get_world_to_actor_transform } from "../model/geometry/actor-space-transform"
import { PivotRotation } from "../model/PivotRotation"
import { Rotation } from "../model/Rotation"
import { Vector } from "../model/Vector"

export const rotate_command: ICommandInfoV2 = {
    description: 'Rotate objects or vertexes',
    shortcut: 'r',
    args: [
        {
            interaction_type: InteractionType.RotationInput,
            example_values: [new PivotRotation(new Vector(1, 1, 1), new Rotation(90, 0, 0))]
        }
    ],
    exec: (state, pivot_rotation: PivotRotation) => {
        const pivot_rotation_transform = pivot_rotation.to_transform_fn()
        return state.vertex_mode
            ? change_selected_brushes(state, (old_brush, actor) => {
                const actor_to_world = get_actor_to_world_transform(actor)
                const world_to_actor = get_world_to_actor_transform(actor)
                const new_brush = old_brush.shallow_copy()
                let change = false
                new_brush.vertexes = new_brush.vertexes.map(v => {
                    if (v.selected){
                        change = true
                        const world_position = actor_to_world(v.position)
                        const world_transformed = pivot_rotation_transform(world_position)
                        const new_position = world_to_actor(world_transformed)
                        return new BrushVertex(new_position, v.selected)
                    } else {
                        return v
                    }
                })
                return change ? new_brush : old_brush
            })
            : change_selected_actors(state, actor => {
                const new_obj = actor.shallow_copy()
                new_obj.location = pivot_rotation_transform(actor.location)
                new_obj.rotation = new_obj.rotation.add_rotation(pivot_rotation.rotation)
                return new_obj
            })
    }
}