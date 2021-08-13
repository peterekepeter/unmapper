import { Actor } from "../Actor"
import { EditorState } from "../EditorState"
import { UnrealMap } from "../UnrealMap"
import { change_map } from "./change_map"


export function change_actors_list(state: EditorState, actor_list_fn: (a: Actor[]) => Actor[]): EditorState {
    return change_map(state, map => {
        const new_actors = actor_list_fn(state.map.actors)
        if (new_actors === state.map.actors) {
            return map
        }
        if (new_actors == null){
            throw new Error("failed to change actor list")
        }
        const next_map = new UnrealMap()
        next_map.actors = new_actors
        return next_map
    })
}
