import { ICommandInfoV2 } from "../controller/command"
import { create_actor_selection } from "../model/EditorSelection"
import { EditorState } from "../model/EditorState"
import { load_map_from_string } from "../model/loader"

export const import_from_string_command: ICommandInfoV2 = {
    exec: import_from_string
}

function import_from_string(state: EditorState, str: string): EditorState {
    const imported_actors = load_map_from_string(str).actors
    return { ...state, 
        map: { 
                ... state.map, 
            actors: [
                ...state.map.actors,
                ...imported_actors
            ]},
        selection: { 
            actors: imported_actors.map((a, i) => create_actor_selection(i)) 
        }
    }
}