import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"
import { ImplementationError } from "../../model/error"
import { Vector } from "../../model/Vector"
import { ALL_VIEWPORT_MODES, ViewportMode } from "../../model/ViewportMode"

export const propose_interaction_point_command: ICommandInfoV2 = { 
    exec: propose_interaction_point, 
    keep_status_by_default: true, 
}

function propose_interaction_point(state: EditorState, point: Vector, mode: ViewportMode): EditorState{
    ImplementationError.if_not(point instanceof Vector, "point must be of type Vector")
    ImplementationError.if(ALL_VIEWPORT_MODES.indexOf(mode) === -1, "move should be a ViewMode")
    
    const confirmed = state.interaction_buffer.confirmed_points
    const next_array = [...state.interaction_buffer.points]

    next_array[confirmed] = point

    return {
        ...state,
        interaction_buffer: {
            ...state.interaction_buffer,
            points: next_array,
            viewport_mode: mode,
        }, 
    }
}
