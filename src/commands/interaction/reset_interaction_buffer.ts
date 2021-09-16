import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"
import { DEFAULT_INTERACTION_BUFFER } from "../../model/InteractionBuffer"

export const reset_interaction_buffer_command: ICommandInfoV2 = { 
    exec: reset_interaction_buffer, 
    keep_status_by_default: true, 
}

function reset_interaction_buffer(state: EditorState): EditorState{
    return {
        ...state,
        interaction_buffer: DEFAULT_INTERACTION_BUFFER,
    }
}
