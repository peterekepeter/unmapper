import { ICommandInfoV2 } from "../../controller/command";
import { Actor } from "../../model/Actor";
import { change_actors } from "../../model/algorithms/editor_state_change";
import { EditorState } from "../../model/EditorState";


export const toggle_actor_selected_command: ICommandInfoV2 = {
    exec(state: EditorState, target: Actor) : EditorState{
        return change_actors(state, a => a !== target ? a 
            : target.immutable_update(actor => actor.selected = !actor.selected));
    }
}
