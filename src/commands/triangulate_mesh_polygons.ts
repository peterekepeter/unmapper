import { ICommandInfoV2 } from "../controller/command_registry";
import { change_selected_brushes } from "../model/algorithms/editor_state_change";
import { triangulate_brush } from "../model/algorithms/triangluate";
import { EditorState } from "../model/EditorState";

export const triangulate_mesh_polygons_command : ICommandInfoV2 = {
    description: "Triangulate Mesh Polygons",
    exec(state: EditorState){
        return change_selected_brushes(state, triangulate_brush);
    }
}