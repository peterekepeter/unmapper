import { EditorState } from "../model/EditorState";

export const description = "Toggle Vertex Mode";

export const shortcut = "tab";

export function implementation(state : EditorState) : EditorState {
    const next_state = { ...state };
    next_state.vertex_mode = !state.vertex_mode;
    return next_state;
}
