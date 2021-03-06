import { ICommandInfoV2 } from "../controller/command";
import { change_selected_brushes } from "../model/algorithms/editor_state_change";
import { createBrushPolygon } from "../model/algorithms/createBrushPolygon";
import { EditorError } from "../model/error/EditorError";
import { EditorState } from "../model/EditorState";


export const create_polygon_command : ICommandInfoV2 = {
    description: "Create polygon from selected vertexes",
    shortcut: "f",
    exec
}

function exec(state: EditorState) : EditorState {
    if (!state.options.vertex_mode){
        throw new EditorError("Need to be in vertex mode!");
    }
    return change_selected_brushes(state, brush => {
        const selected = brush.getSelectedVertexIndices();
        return createBrushPolygon(brush, selected);
    });
}