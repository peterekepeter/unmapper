import { EditorState, ViewportState } from "../EditorState"
import { change_viewports } from "./change_viewports"


export function change_viewport_at_index(state: EditorState, index: number, viewport_fn: (viewport: ViewportState) => ViewportState): EditorState {
    return change_viewports(state, (viewport, viewport_index) => {
        return viewport_index === index ? viewport_fn(viewport) : viewport
    })
}
