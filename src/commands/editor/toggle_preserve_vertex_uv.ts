import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"


export const toggle_preserve_vertex_uv_command: ICommandInfoV2 = {
    description: "Toggle Preserve Vertex UV",
    shortcut: "alt + u",
    exec: implementation
}

function implementation(state: EditorState): EditorState {
    const next_state: EditorState = {
        ...state, options: {
            ...state.options, preserve_vertex_uv: !state.options.preserve_vertex_uv
        }
    }
    return next_state
}