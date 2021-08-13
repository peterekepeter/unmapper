import { Actor } from "../Actor"
import { EditorState } from "../EditorState"
import { change_actors_list } from "./change_actors_list"


export function change_actors(
    state: EditorState,
    actor_fn: (actor: Actor, index: number) => Actor
): EditorState {
    return change_actors_list(state, actor_list => {
        let has_change = false
        const new_list = []
        for (let i = 0; i < actor_list.length; i++) {
            const actor = actor_list[i]
            const new_actor = actor_fn(actor, i)
            if (!new_actor) {
                throw new Error('unexpected null actor result')
            }
            if (new_actor !== actor) {
                has_change = true
            }
            new_list.push(new_actor)
        }
        if (has_change) {
            return new_list
        }
        return actor_list
    })
}
