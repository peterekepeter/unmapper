import { ActorSelection } from "../EditorSelection"
import { EditorState } from "../EditorState"

export function change_actor_selection(
    state: EditorState, 
    actor_index: number, 
    fn: (actor_selection:ActorSelection, actor_index: number) => ActorSelection
): EditorState {
    if (actor_index < 0 || actor_index > state.map.actors.length){
        throw new Error("actor index out of range")
    }
    const old_selection = state.selection.actors.find(a => a.actor_index === actor_index)
    const new_selection = fn(old_selection, actor_index)
        if (old_selection === new_selection) {
        return state
    }
    if (new_selection != null && new_selection.actor_index !== actor_index){
        throw new Error("cannot select another actor when changings election of given actor")
    }
    if (old_selection == null)
    {
        if (new_selection == null){
            // deleted both before and after so it's a noop
            return state
        }
        else {
            // add newly selected actor
            return { ...state, selection: { ...state.selection, 
                actors: [ ...state.selection.actors, new_selection ]
            }}
        }
    }
    else {
        if (new_selection == null) {
            // no longer selected, delete actor selection
            return { ...state, selection: { ...state.selection, 
                actors: state.selection.actors.filter(a => a.actor_index !== actor_index )
            }}
        }
        else {
            // selection changed within the actor
            return { ...state, selection: { ...state.selection, 
                actors: state.selection.actors.map(
                    a => a.actor_index === actor_index ? new_selection : a
                )
            }}
        }
    }
} 