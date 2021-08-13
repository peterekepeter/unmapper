import { Actor } from "../Actor"
import { EditorSelection } from "../EditorSelection"
import { EditorState } from "../EditorState"
import { EditorError } from "../error/EditorError"


export function change_selected_actors(
    state: EditorState,
    actor_fn: (actor: Actor, selected_actor: EditorSelection["actors"][0]) => Actor
): EditorState {
    if (!state.selection.actors
        || state.selection.actors.length === 0) {
        return state
    }
    const new_actors = [...state.map.actors]
    for (const selected_actor of state.selection.actors) {
        const index = selected_actor.actor_index
        const new_actor = actor_fn(new_actors[index], selected_actor)
        if (new_actor == null)
        {
            throw new EditorError("unexpected actor result")
        }
        new_actors[index] = new_actor
    }
    return { ...state, map: { actors: new_actors } }

}
