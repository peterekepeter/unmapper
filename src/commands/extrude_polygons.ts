import { ICommandInfoV2 } from "../controller/command";
import { change_selected_brushes } from "../model/algorithms/editor_state_change";
import { extrude_brush_faces } from "../model/algorithms/extrudeBrushFaces";
import { EditorError } from "../model/EditorError";
import { EditorState } from "../model/EditorState";
import { InteractionType } from "../model/interactions/InteractionType";
import { Vector } from "../model/Vector";


export const extrude_polygons_command : ICommandInfoV2 = { 
    description: "Extrude selected polygons",
    shortcut: 'e',
    exec: implementation,
    args: [
        {
            interaction_type: InteractionType.VectorOrScalarInput,
            name: "extrusion",
            example_values: [32, new Vector(32,0,0)],
            default_value: 32
        }
    ]
}

function implementation(state: EditorState, distance = 32.0) : EditorState {
    if (!state.vertex_mode){
        throw new EditorError('only works in vertex mode');
    }
    return change_selected_brushes(state, brush => {
        const polygon_indexes = brush.getSelectedPolygonIndices();
        return extrude_brush_faces(brush, polygon_indexes, distance);
    });
}