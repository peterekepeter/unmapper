import { ICommandInfoV2 } from "../../controller/command"
import { Actor } from "../../model/Actor"
import { create_actor_selection } from "../../model/EditorSelection"
import { EditorState, get_actor_index } from "../../model/EditorState"


export const make_actor_selection_command : ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: make_actor_selection,
}

function make_actor_selection(state: EditorState, to_select : Actor): EditorState {
    const actor_index = get_actor_index(state, to_select)
    return { ...state, selection: { ...state.selection, 
        actors: [create_actor_selection(actor_index)]
    }}
}