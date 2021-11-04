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

function make_actor_selection(state: EditorState, target : Actor | number): EditorState {
    if (target == null){
        return clear_selection(state)
    }
    const actor_index = typeof target === 'number' ? target : get_actor_index(state, target)
    const new_selection = [create_actor_selection(actor_index)]
    return replace_actor_selection(state, new_selection)
}
