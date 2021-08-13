import { ICommandInfoV2 } from "../../controller/command"
import { Actor } from "../../model/Actor"
import { EditorState, get_actor_index } from "../../model/EditorState"
import { change_actor_selection } from "../../model/state/change_actor_selection"


export const select_toggle_vertex_command: ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: select_toggle_vertex
}

function select_toggle_vertex(state: EditorState, target: Actor, actor_vertex_index : number): EditorState
{
    const actor_index = get_actor_index(state, target)
    return change_actor_selection(state, actor_index, selection => ({
        ...selection, 
        vertexes: selection.vertexes.indexOf(actor_vertex_index) === -1 
            ? [...selection.vertexes, actor_vertex_index]
            : selection.vertexes.filter(v => v !== actor_vertex_index)
    }))
}
