import { EditorState, ViewportState } from "../EditorState"


export function change_viewport_list(state: EditorState, viewport_fn: (viewport: ViewportState[]) => ViewportState[]): EditorState {
    const next_viewport_list = viewport_fn(state.viewports)
    if (next_viewport_list === state.viewports) {
        return state
    }
    const next_state = { ...state }
    next_state.viewports = next_viewport_list
    return next_state
}
