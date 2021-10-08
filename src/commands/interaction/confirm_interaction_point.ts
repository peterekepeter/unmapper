import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"
import { ImplementationError } from "../../model/error"
import { Vector } from "../../model/Vector"
import { ALL_VIEWPORT_MODES, ViewportMode } from "../../model/ViewportMode"

export const confirm_interaction_point_command: ICommandInfoV2 = { 
    exec: confirm_interaction_point, 
    keep_status_by_default: true, 
}

function confirm_interaction_point(state: EditorState, point: Vector, mode: ViewportMode): EditorState{
    ImplementationError.if_not(point instanceof Vector)
    ImplementationError.if(ALL_VIEWPORT_MODES.indexOf(mode) === -1)
    const confirmed = state.interaction_buffer.confirmed_points
    const next_array = [...state.interaction_buffer.points]
    next_array[confirmed] = point
    const next_confirmed = confirmed + 1

    return {
        ...state,
        interaction_buffer: {
            ...state.interaction_buffer,
            points: next_array,
            confirmed_points: next_confirmed,
            viewport_mode: mode,
        }, 
    }
}
