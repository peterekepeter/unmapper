import { EditorState } from "../EditorState"
import { UnrealMap } from "../UnrealMap"


export function change_map(state: EditorState, map_fn: (map: UnrealMap) => UnrealMap): EditorState {
    const next_map = map_fn(state.map)
    if (next_map === state.map) {
        return state
    }
    const next_state = { ...state }
    next_state.map = next_map
    return next_state
}
