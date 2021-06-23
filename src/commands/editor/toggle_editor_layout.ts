import { ICommandInfoV2 } from "../../controller/command"


const LAYOUT_COUNT = 6

export const toggle_editor_layout_command : ICommandInfoV2 = {
    description: "Toogle Editor Layout",
    shortcut: "ctrl + alt + l",
    exec: state => ({
        ...state, 
        options: { 
            ...state.options, 
            editor_layout: (state.options.editor_layout + 1) % LAYOUT_COUNT 
        }
    })
}
