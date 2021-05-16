import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"


export const toggle_box_select_command: ICommandInfoV2 = {
    description: "Toogle Box Select",
    shortcut: "b",
    exec: toggle_box_select
}

export function toggle_box_select(state: EditorState, box_select?: boolean): EditorState {
    const next = ({
        ...state,
        options: {
            ...state.options,
            box_select_mode: box_select ?? !state.options.box_select_mode
        }
    })
    return next
}