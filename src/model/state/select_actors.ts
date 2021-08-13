import { filter_map } from "../../util/filter_map"
import { Actor } from "../Actor"
import { DEFAULT_ACTOR_SELECTION, EditorSelection } from "../EditorSelection"
import { EditorState } from "../EditorState"


export function select_actors(state: EditorState, filter: (actor: Actor) => boolean): EditorState {
    const selection: EditorSelection = {
        actors: filter_map(state.map.actors, filter, (_, index) => ({
            ...DEFAULT_ACTOR_SELECTION,
            actor_index: index
        }))
    }
    return { ...state, selection }
}
