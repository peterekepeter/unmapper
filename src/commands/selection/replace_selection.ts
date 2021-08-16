import { ICommandInfoV2 } from "../../controller/command"
import { ActorSelection, create_actor_selection, EditorSelection, has_no_geometry_selection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"

export const replace_selection_command : ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: replace_selection,
}

export function replace_selection(
    state: EditorState, 
    selection: EditorSelection,
): EditorState {
    if (state.options.vertex_mode){
        return replace_vertex_selection(state, selection)
    } 
    else {
        return replace_actor_selection(state, selection.actors)
    }
}

function replace_vertex_selection(state: EditorState, to_replace_with: EditorSelection): EditorState
{
    if (to_replace_with.actors.length === 0 && 
        state.selection.actors.find(a => has_no_geometry_selection(a))){
        return state
    }
    const result: ActorSelection[] = []
    for (const selection of state.selection.actors){
        const replace_with = to_replace_with.actors.find(r => r.actor_index === selection.actor_index)
        if (!replace_with){
            // clear geometry selection 
            if (has_no_geometry_selection(selection)){
                result.push(selection)
            }
            else {
                result.push(create_actor_selection(selection.actor_index))
            }
        } else {
            result.push(replace_with)
        }
    }
    return replace_actor_selection(state, result)
}

export function replace_actor_selection(
    state: EditorState, 
    actor_selection: ActorSelection[],
): EditorState
{
    return { 
        ...state,
        selection: {
            ...state.selection,
            actors: actor_selection, 
        }, 
    }
}
