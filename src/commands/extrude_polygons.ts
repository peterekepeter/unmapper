import { ICommandInfoV2 } from "../controller/command";
import { change_selected_brushes } from "../model/algorithms/editor_state_change";
import { extrude_brush_faces } from "../model/algorithms/extrudeBrushFaces";
import { EditorError } from "../model/EditorError";
import { EditorState } from "../model/EditorState";
import { InteractionType } from "../controller/interactions/InteractionType";
import { Vector } from "../model/Vector";
import { get_world_to_actor_rotation_scaling } from "../model/geometry/actor-space-transform";


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

function implementation(state: EditorState, extrusion: number | Vector = 32) : EditorState {
    if (!state.vertex_mode){
        throw new EditorError('only works in vertex mode');
    }
    return change_selected_brushes(state, (brush, actor) => {
        if (typeof extrusion !== "number"){
            const matrix = get_world_to_actor_rotation_scaling(actor)
            extrusion = matrix.apply(extrusion)
        }
        const polygon_indexes = brush.getSelectedPolygonIndices()
        return extrude_brush_faces(brush, polygon_indexes, extrusion)
    })
}