import { change_actors_list, change_selected_brushes } from "../model/algorithms/common";
import { deleteBrushData } from "../model/algorithms/deleteBrushData";
import { EditorState } from "../model/EditorState";


export const description = "Delete Selection";
    
export const shortcut = "delete";

export const implementation = (state: EditorState) =>
    state.vertex_mode
        ? delete_vertexes(state)
        : delete_actors(state);

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
    });
