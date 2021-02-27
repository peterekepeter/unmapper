import { ICommandInfoV2 } from "../../controller/command"


const LAYOUT_COUNT = 3

export const toggle_editor_layout_command : ICommandInfoV2 = {
    description: "Toogle Editor Layout",
    shortcut: "ctrl + alt + l",
    exec: state => ({
        ...state, 
        editor_layout: (state.editor_layout + 1) % LAYOUT_COUNT 
    })
}
