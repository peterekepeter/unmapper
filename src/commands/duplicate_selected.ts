import { ICommandInfoV2 } from "../controller/command"
import { DEFAULT_ACTOR_SELECTION } from "../model/EditorSelection"
import { EditorState } from "../model/EditorState"
import { EditorError } from "../model/error"
import { move_selected } from "./move_selected"

export const duplicate_selected_command: ICommandInfoV2 = {
    description: 'Duplicate selected actors',
    shortcut: 'd',
    uses_interaction_buffer: true,
    exec: duplicate_selected,
}

function duplicate_selected(state: EditorState): EditorState {
    EditorError.if(state.options.vertex_mode, "Duplicate only works in object mode.")
    const data = state.selection.actors.map(s => state.map.actors[s.actor_index].shallow_copy())
    const state_with_duplicates: EditorState = {
        ...state,
        map: { actors: [...state.map.actors, ...data] },
        selection: { 
            actors: data.map((_, index) => ({ 
                ...DEFAULT_ACTOR_SELECTION,
                actor_index: index + state.map.actors.length, 
            })), 
        },
    }
    return move_selected(state_with_duplicates)
}
