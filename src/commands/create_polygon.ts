import { change_selected_brushes } from "../model/algorithms/common";
import { createBrushPolygon } from "../model/algorithms/createBrushPolygon";
import { EditorError } from "../model/EditorError";
import { EditorState } from "../model/EditorState";

export const description = "Create polygon from selected vertexes";

export const shortcut = "f";

export function implementation(state: EditorState) : EditorState {
    if (!state.vertex_mode){
        throw new EditorError("Need to be in vertex mode!");
    }
    return change_selected_brushes(state, brush => {
        const selected = brush.getSelectedVertexIndices();
        return createBrushPolygon(brush, selected);
    });
}