import { ICommandInfoV2 } from "../controller/command"
import { create_actor_selection } from "../model/EditorSelection"
import { EditorState } from "../model/EditorState"
import { load_map_from_string } from "../model/loader"
import { range } from "../util/range"

export const import_from_string_command: ICommandInfoV2 = { exec: import_from_string }

function import_from_string(state: EditorState, text: string): EditorState {
    const imported_actors = load_map_from_string(text).actors
    const first = state.map.actors.length
    const last = first + imported_actors.length
    return {
        ...state, 
        map: { 
            ... state.map, 
            actors: [
                ...state.map.actors,
                ...imported_actors,
            ], 
        },
        selection: { actors: range(first, last).map(create_actor_selection) },
    }
}
