import { ICommandInfoV2 } from "../controller/command"
import { extrude_brush_faces } from "../model/algorithms/extrudeBrushFaces"
import { EditorError } from "../model/error/EditorError"
import { EditorState } from "../model/EditorState"
import { Vector } from "../model/Vector"
import { get_world_to_actor_rotation_scaling } from "../model/geometry/actor-space-transform"
import { VectorInteraction } from "../controller/interactions/VectorInteraction"
import { change_selected_brushes } from "../model/state"
import { is_null_or_empty } from "../util/is_null_or_empty"


export const extrude_polygons_command : ICommandInfoV2 = { 
    description: "Extrude selected polygons",
    shortcut: 'e',
    exec: implementation,
    args: [
        {
            interaction_factory: () => new VectorInteraction(),
            name: "extrusion",
            example_values: [32, new Vector(32,0,0)],
            default_value: 32
        }
    ]
}

function implementation(state: EditorState, extrusion: number | Vector = 32) : EditorState {
    if (!state.options.vertex_mode){
        throw new EditorError('only works in vertex mode')
    }
    return change_selected_brushes(state, (brush, actor, selection) => {
        if (is_null_or_empty(selection.polygons)){
            return brush
        }
        if (typeof extrusion !== "number"){
            const matrix = get_world_to_actor_rotation_scaling(actor)
            extrusion = matrix.apply(extrusion)
        }
        return extrude_brush_faces(brush, selection.polygons, extrusion)
    })
}