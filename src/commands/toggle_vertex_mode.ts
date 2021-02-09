import { ICommandInfoV2 } from "../controller/command_registry";
import { EditorState } from "../model/EditorState";


export const toggle_vertex_mode_command : ICommandInfoV2 = {
    description: "Toggle Vertex Mode",
    shortcut: "tab",
    exec: implementation
}

function implementation(state : EditorState) : EditorState {
    const next_state = { ...state };
    next_state.vertex_mode = !state.vertex_mode;
    return next_state;
}