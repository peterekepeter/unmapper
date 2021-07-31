import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"


export const clear_status_command: ICommandInfoV2 = {
    exec: clear_status,
    description: 'Clear the status and interaction',
    shortcut: 'Escape'
}

function clear_status(state: EditorState): EditorState {
    return { ...state, status: { is_error: false, message: "" } }
}