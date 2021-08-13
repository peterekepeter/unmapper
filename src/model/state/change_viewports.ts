import { EditorState, ViewportState } from "../EditorState"
import { change_viewport_list } from "./change_viewport_list"


export function change_viewports(state: EditorState, viewport_fn: (viewport: ViewportState, index: number) => ViewportState): EditorState {
    return change_viewport_list(state, viewports => {
        let has_change = false
        const new_list = []
        let index = 0
        for (const viewport of viewports) {
            const new_viewport = viewport_fn(viewport, index)
            if (!new_viewport) {
                throw new Error('unexpected null viewport result')
            }
            if (new_viewport !== viewport) {
                has_change = true
            }
            new_list.push(new_viewport)
            index++
        }
        if (has_change) {
            return new_list
        }
        return viewports
    })
}
