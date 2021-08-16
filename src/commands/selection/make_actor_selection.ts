import { ICommandInfoV2 } from "../../controller/command"
import { Actor } from "../../model/Actor"
import { create_actor_selection } from "../../model/EditorSelection"
import { EditorState, get_actor_index } from "../../model/EditorState"
import { clear_selection } from "./clear_selection"
import { replace_actor_selection } from "./replace_selection"

export const make_actor_selection_command : ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: make_actor_selection,
}

function make_actor_selection(state: EditorState, to_select : Actor): EditorState {
    if (to_select == null){
        return clear_selection(state)
    }
    const actor_index = get_actor_index(state, to_select)
    const new_selection = [create_actor_selection(actor_index)]
    return replace_actor_selection(state, new_selection)
}
