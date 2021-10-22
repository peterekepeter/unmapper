import { ICommandInfoV2 } from "../controller/command"
import { RotationInteraction } from "../controller/interactions/stateful/RotationInteraction"
import { ViewportVectorAdjustment } from "../controller/interactions/ViewportVectorAdjustment"
import { BrushVertex } from "../model/BrushVertex"
import { complete_interaction, EditorState } from "../model/EditorState"
import { get_actor_to_world_transform, get_world_to_actor_transform } from "../model/geometry/actor-space-transform"
import { decompose_matrix_rotation } from "../model/geometry/decompose-matrix"
import { vector_to_vector_rotation_matrix } from "../model/geometry/vector-rotation"
import { InteractionBuffer } from "../model/InteractionBuffer"
import { PivotRotation } from "../model/PivotRotation"
import { Rotation } from "../model/Rotation"
import { change_selected_actors, change_selected_brushes } from "../model/state"
import { Vector } from "../model/Vector"

export const rotate_command: ICommandInfoV2 = {
    description: 'Rotate objects or vertexes',
    shortcut: 'r',
    uses_interaction_buffer: true,
    args: [
        {
            interaction_factory: RotationInteraction.factory,
            example_values: [new PivotRotation(new Vector(1, 1, 1), new Rotation(90, 0, 0))],
        },
    ],
    exec: exec_rotation_command,
}

function exec_rotation_command(state: EditorState): EditorState {
    if (state.interaction_buffer.points.length < 3){
        return state
    }
    
    const pivot_rotation = get_rotation_from_interaction(state.interaction_buffer)
    const rotated = apply_rotation_to_selected(state, pivot_rotation)
    return complete_interaction(rotated)
}

function get_rotation_from_interaction(buffer : InteractionBuffer): PivotRotation {
    const [pivot, from_point, to_point] = buffer.points
    const rotation_center = pivot
    let pitch = 0, yaw = 0, roll = 0

    if (buffer.scalar != null){
        // rotate based on scalar
        const value = buffer.scalar.value
        if (!buffer.axis_lock.z_axis){
            yaw = value
        } else if (!buffer.axis_lock.y_axis){
            pitch = value
        } else if (!buffer.axis_lock.x_axis){
            roll = value
        }
    } else {
        // rotate based on interaction points
        const adjustment = new ViewportVectorAdjustment(rotation_center, buffer.viewport_mode)
        const from = adjustment.adjust(from_point).subtract_vector(pivot)
        const to = adjustment.adjust(to_point).subtract_vector(pivot)
        const rotation_matrix = vector_to_vector_rotation_matrix(from, to)
        const decomposed_rotation = decompose_matrix_rotation(rotation_matrix)[0]
        pitch = decomposed_rotation.pitch
        roll = decomposed_rotation.roll
        yaw = decomposed_rotation.yaw
    }
    
    if (buffer.axis_lock.z_axis) {
        yaw = 0
    }
    if (buffer.axis_lock.y_axis) {
        pitch = 0
    }
    if (buffer.axis_lock.x_axis) {
        roll = 0
    }

    const rotation = new Rotation(pitch, yaw, roll)
    return new PivotRotation(pivot, rotation)
}

function apply_rotation_to_selected(state : EditorState, pivot_rotation: PivotRotation): EditorState{
    const pivot_rotation_transform = pivot_rotation.to_transform_fn()
    return state.options.vertex_mode
        ? change_selected_brushes(state, (old_brush, actor, selection) => {
            const actor_to_world = get_actor_to_world_transform(actor)
            const world_to_actor = get_world_to_actor_transform(actor)
            const new_brush = old_brush.shallow_copy()
            let change = false
            new_brush.vertexes = new_brush.vertexes.map((v, i) => {
                if (selection.vertexes.indexOf(i) !== -1){
                    change = true
                    const world_position = actor_to_world(v.position)
                    const world_transformed = pivot_rotation_transform(world_position)
                    const new_position = world_to_actor(world_transformed)
                    return new BrushVertex(new_position)
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
