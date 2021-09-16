import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"
import { Vector } from "../../model/Vector"
import { ViewportMode } from "../../model/ViewportMode"

export const add_interaction_point_command: ICommandInfoV2 = { 
    exec: add_interaction_point, 
    keep_status_by_default: true, 
}

function add_interaction_point(state: EditorState, point: Vector, mode: ViewportMode): EditorState{
    return {
        ...state,
        interaction_buffer: {
            ...state.interaction_buffer,
            points: [...state.interaction_buffer.points, point],
            viewport_mode: mode,
        }, 
    }
}
