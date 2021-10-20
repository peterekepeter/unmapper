import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { get_world_to_actor_transform } from "../model/geometry/actor-space-transform"
import { DEFAULT_INTERACTION_BUFFER, InteractionBuffer } from "../model/InteractionBuffer"
import { change_selected_actors, change_selected_brushes, change_selected_vertexes } from "../model/state"
import { Vector } from "../model/Vector"

export const scale_command: ICommandInfoV2 = {
    description: 'Scale objects or vertexes',
    shortcut: 's',
    uses_interaction_buffer: true,
    exec: exec_scale_command,
}

function exec_scale_command(state: EditorState): EditorState {
    const buffer= state.interaction_buffer
    const points = buffer.points
    const scaling_factor : number = get_scaling_factor(buffer)
    if (scaling_factor === 1){
        return state
    }
    const pivot = points[0]
    const scaled = scale_selected(state, pivot, scaling_factor)
    return {
        ...scaled,
        interaction_buffer: DEFAULT_INTERACTION_BUFFER,
    }
}

function get_scaling_factor(buffer: InteractionBuffer): number {
    let scaling_factor = 1
    if (buffer.scalar){
        scaling_factor = buffer.scalar.value
    }
    else if (buffer.points.length >= 3){
        const [pivot, from, to] = buffer.points
        scaling_factor = to.subtract_vector(pivot).length() 
        / from.subtract_vector(pivot).length()
    }
    return scaling_factor
}

function scale_selected(state: EditorState, pivot: Vector, scaling_factor: number){
    if (scaling_factor === 1){
        return state
    }
    if (!pivot){
        pivot = Vector.ZERO
    }
    if (state.options.vertex_mode){
        return scale_geometry_data(state, pivot, scaling_factor)
    } else {
        return scale_actors(state, pivot, scaling_factor)
    }
}

function scale_geometry_data(state: EditorState, pivot: Vector, scaling_factor: number): EditorState {
    return change_selected_brushes(state, (b, a, s) => {
        const transform_fn = get_world_to_actor_transform(a)
        const actor_pivot = transform_fn(pivot)
        return change_selected_vertexes(b, s.vertexes, v => v
            .subtract_vector(actor_pivot)
            .scale(scaling_factor)
            .add_vector(actor_pivot))

    })
}

function scale_actors(state: EditorState, pivot: Vector, scaling_factor: number): EditorState {
    return change_selected_actors(state, old => {

        const new_location = old.location
            .subtract_vector(pivot)
            .scale(scaling_factor)
            .add_vector(pivot)
        const new_actor = old.shallow_copy()
        new_actor.location = new_location
        if (old.brushModel) {
            const new_component_scaling = Vector.ONES.scale(scaling_factor)
            new_actor.postScale = old.postScale.with_scale_vector(new_component_scaling)
        } else {
            // scale object
        }
        return new_actor
    })
}
