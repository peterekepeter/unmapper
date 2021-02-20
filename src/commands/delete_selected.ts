import { ICommandInfoV2 } from "../controller/command";
import { change_actors_list, change_selected_brushes } from "../model/algorithms/editor_state_change";
import { deleteBrushData } from "../model/algorithms/deleteBrushData";
import { EditorState } from "../model/EditorState";


export const delete_selected_command: ICommandInfoV2 = {
    description: "Delete Selection",
    shortcut: "delete",
    exec: implementation
}

function implementation(state: EditorState): EditorState {
    return state.vertex_mode
        ? delete_vertexes(state)
        : delete_actors(state)
}

const delete_vertexes = (state: EditorState) =>
    change_selected_brushes(state, b => deleteBrushData(b, {
        vertexes: b.getSelectedVertexIndices()
    }));

const delete_actors = (state: EditorState) =>
    change_actors_list(state, actors => {
        const next_actors = actors.filter(a => !a.selected);
        if (next_actors.length !== state.map.actors.length) {
            return next_actors;
        }
        return actors;
    })