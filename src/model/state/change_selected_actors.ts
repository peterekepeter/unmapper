import { Actor } from "../Actor"
import { ActorSelection } from "../EditorSelection"
import { EditorState } from "../EditorState"

export type ActorChangeResult = undefined|null|Actor|Actor[];

export type ActorChangeFn = (actor: Actor, selected_actor: ActorSelection) => ActorChangeResult

export function change_selected_actors(
    state: EditorState,
    actor_fn: ActorChangeFn,
): EditorState {
    if (!state.selection.actors || state.selection.actors.length === 0) {
        return state
    }
    const prev_actors = state.map.actors

    let has_change = false;
    let need_flatten = false;
    let next_actor_results: ActorChangeResult[] = [...prev_actors];
    for (const selection of state.selection.actors) {
        const actor_index = selection.actor_index
        const actor = prev_actors[actor_index]
        let procesed = actor_fn(actor, selection)
        if (actor === procesed) {
            continue;
        }
        if (procesed instanceof Array) {
            if (procesed.length === 0) procesed = null // handle as deletion
            else if (procesed.length === 1) procesed = procesed[0] // handle as edit
        }
        next_actor_results[actor_index] = procesed
        has_change = has_change || procesed !== actor
        need_flatten = need_flatten || procesed instanceof Array || !procesed
    }

    if (!has_change) {
        return state
    }

    if (!need_flatten) {
        // this reuses the same actor selection
        return {
            ...state,
            map: { actors: next_actor_results as Actor[] }
        }
    }

    let next_actors: Actor[] = [];
    let next_selection: ActorSelection[] = [];

    for (const item of next_actor_results) {
        if (item instanceof Array) {
            for (const subitem of item) {
                next_actors.push(subitem)
            }
        }
        else if (!item) {
        }
        else {
            next_actors.push(item);
        }
    }

    let offset = 0;
    for (const selection of state.selection.actors) {
        let result_item = next_actor_results[selection.actor_index];
        let result_count = result_item instanceof Array ? result_item.length : result_item ? 1 : 0
        offset -= 1
        for (let i=0; i<result_count; i+=1) {
            offset += 1
            next_selection.push({
                ...selection,
                actor_index: selection.actor_index + offset,
            })
        }
    }

    return {
        ...state,
        map: { actors: next_actors },
        selection: { actors: next_selection },
    }

}

