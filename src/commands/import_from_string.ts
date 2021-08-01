import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { load_map_from_string } from "../model/loader"

export const import_from_string_command: ICommandInfoV2 = {
    exec: import_from_string
}

function import_from_string(state: EditorState, str: string): EditorState {
    const imported_actors = load_map_from_string(str).actors
    for (const actor of imported_actors){
        actor.selected = true
    }
    const existing_actors = state.map.actors.map(a => {
        if (a.selected){
            const copy = a.shallow_copy()
            copy.selected = false
            return copy
        }
        else {
            return a
        }
    })
    return { ...state, map: { ... state.map, actors: [
        ...existing_actors,
        ...imported_actors
    ]}}
}