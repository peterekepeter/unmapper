import { ICommandInfoV2 } from "../controller/command_registry";
import { change_selected_brushes } from "../model/algorithms/common";
import { extrudeBrushFaces } from "../model/algorithms/extrudeBrushFaces";
import { EditorError } from "../model/EditorError";
import { EditorState } from "../model/EditorState";


export const extrude_polygons_command : ICommandInfoV2 = { 
    description: "Extrude selected polygons by 32 units",
    shortcut: 'e',
    exec: implementation
}

function implementation(state: EditorState, distance = 32.0) : EditorState {
    if (!state.vertex_mode){
        throw new EditorError('only works in vertex mode');
    }
    return change_selected_brushes(state, brush => {
        const polygon_indexes = brush.getSelectedPolygonIndices();
        return extrudeBrushFaces(brush, polygon_indexes, distance);
    });
}