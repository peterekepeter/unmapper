import { ICommandInfoV2 } from "../controller/command"
import { createBrushPolygon } from "../model/algorithms/createBrushPolygon"
import { deleteBrushData } from "../model/algorithms/deleteBrushData"
import { EditorState } from "../model/EditorState"
import { EditorError } from "../model/error"
import { get_actor_to_world_transform_optimized, get_world_to_actor_rotation_scaling, get_world_to_actor_transform } from "../model/geometry/actor-space-transform"
import { change_selected_actors, change_selected_brushes } from "../model/state"
import { change_selected_vertexes } from "../model/state_updates/change_selected_vertexes"
import { Vector } from "../model/Vector"
import { ViewportMode } from "../model/ViewportMode"
import { create_polygon_command } from "./create_polygon"


export const merge_faces_command: ICommandInfoV2 = {
    description: 'Merge faces',
    uses_interaction_buffer: true,
    exec: merge_selected_faces,
}


function merge_selected_faces(state: EditorState): EditorState {
    EditorError.if(!state.options.vertex_mode, "To merge faces you should be in vertex mode")
    return change_selected_brushes(state, (brush, actor, selection) => {
        const verts = new Set(selection.polygons.flatMap(p => brush.polygons[p].vertexes));
        brush = deleteBrushData(brush, { polygons: selection.polygons });
        brush = createBrushPolygon(brush, [...verts]);
        return brush;
    })
}


