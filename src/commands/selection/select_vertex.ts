import { ICommandInfoV2 } from "../../controller/command"
import { Actor } from "../../model/Actor"
import { EditorState, get_actor_index } from "../../model/EditorState"
import { change_actor_selection } from "../../model/state/change_actor_selection"

export const select_vertex_command: ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: select_vertex
}

export function select_vertex(state: EditorState, target: Actor, actor_vertex_index: number): EditorState {
    if (target == null || actor_vertex_index === -1){
        return { ...state, selection: {...state.selection, 
            actors: state.selection.actors.map(a => ({...a, vertexes: [] }))
        }}
    }
    const actor_index = get_actor_index(state, target)
    return change_actor_selection(state, actor_index, 
        actor_selection => ({ ...actor_selection, vertexes:[actor_vertex_index]}))
}