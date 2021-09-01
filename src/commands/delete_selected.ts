import { ICommandInfoV2 } from "../controller/command"
import { deleteBrushData } from "../model/algorithms/deleteBrushData"
import { EditorState } from "../model/EditorState"
import { change_selected_brushes } from "../model/state"
import { change_actors_list } from "../model/state/change_actors_list"
import { pipe } from "../util/pipe"
import { clear_selection } from "./selection/clear_selection"

export const delete_selected_command: ICommandInfoV2 = {
    description: "Delete Selection",
    shortcut: "delete",
    exec: pipe(delete_selected_data, clear_selection),
}

function delete_selected_data(state: EditorState): EditorState {
    return state.options.vertex_mode
        ? delete_vertexes(state)
        : delete_actors(state)
}

function delete_vertexes(state: EditorState) {
    return change_selected_brushes(state, ((b, _, selection) => deleteBrushData(b, selection)))
}

function delete_actors(state: EditorState) {
    return change_actors_list(state, actors => {
        const next_actors = actors.filter((_, index) => state.selection.actors.find(s => s.actor_index === index) == null)
        if (next_actors.length !== state.map.actors.length) {
            return next_actors
        }
        return actors
    })
}
