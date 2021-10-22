import { ICommandInfoV2 } from "../controller/command"
import { extrude_brush_faces } from "../model/algorithms/extrudeBrushFaces"
import { complete_interaction, EditorState } from "../model/EditorState"
import { EditorError } from "../model/error/EditorError"
import { get_world_to_actor_rotation_scaling } from "../model/geometry/actor-space-transform"
import { change_selected_brushes } from "../model/state"
import { Vector } from "../model/Vector"
import { is_null_or_empty } from "../util/is_null_or_empty"

export const extrude_polygons_command : ICommandInfoV2 = { 
    description: "Extrude selected polygons",
    shortcut: 'e',
    exec: exec_extrude_selected_polygons,
    uses_interaction_buffer: true,
}

function exec_extrude_selected_polygons(state: EditorState) : EditorState {
    const buffer = state.interaction_buffer
    let extrusion: Vector | number | null = null
    if (buffer.scalar) {
        extrusion = buffer.scalar.value
    }
    else if (buffer.points.length >= 2){
        extrusion = buffer.points[0].vector_to_vector(buffer.points[1])
    }
    if (extrusion == null){
        return state
    }
    const extruded = extrude_selected_polygons(state, extrusion)
    return complete_interaction(extruded)
}

function extrude_selected_polygons(state: EditorState, extrusion: number | Vector) : EditorState {
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
