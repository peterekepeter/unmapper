import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"

export const show_error_status_command: ICommandInfoV2 = {
    exec: show_error_status
}

function show_error_status(state: EditorState, message: string): EditorState {
    return { ...state, status: { ...state.status, is_error: true, message: message || "Uknown error" } }
}