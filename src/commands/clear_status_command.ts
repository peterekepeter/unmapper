import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { pipe } from "../util/pipe"
import { reset_interaction_buffer_command } from "./interaction/reset_interaction_buffer"

export const clear_status_command: ICommandInfoV2 = {
    exec: pipe(clear_status, reset_interaction_buffer_command.exec),
    description: 'Clear the status and interaction',
    shortcut: 'Escape',
}

function clear_status(state: EditorState): EditorState {
    return { ...state, status: { is_error: false, message: "" } }
}
