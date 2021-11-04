import { ICommandInfoV2 } from "../../controller/command"
import { Actor } from "../../model/Actor"
import { DEFAULT_ACTOR_SELECTION } from "../../model/EditorSelection"
import { EditorState, get_actor_index } from "../../model/EditorState"
import { change_actor_selection } from "../../model/state/change_actor_selection"

export const toggle_actor_selected_command: ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: toggle_actor_selected,
}

function toggle_actor_selected(state: EditorState, target: Actor | number) : EditorState {
    const actor_index = typeof target === 'number' ? target : get_actor_index(state, target)
    return change_actor_selection(
        state, 
        actor_index,
        s => s != null ? null : { ...DEFAULT_ACTOR_SELECTION, actor_index },
    )
}
