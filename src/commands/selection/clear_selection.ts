import { ICommandInfoV2 } from "../../controller/command"
import { DEFAULT_EDITOR_SELECTION } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { replace_selection } from "./replace_selection"

export const clear_selection_command: ICommandInfoV2 = {
    description: 'Clear editor selection',
    shortcut: 'Escape',
    exec: clear_selection,
}

export function clear_selection(state: EditorState): EditorState {
    return replace_selection(state, DEFAULT_EDITOR_SELECTION)
}
