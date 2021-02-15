import { ICommandInfoV2 } from "../controller/command_registry";
import { change_selected_brushes } from "../model/algorithms/editor_state_change";
import { shuffle_brush_polygons } from "../model/algorithms/shuffle";
import { EditorState } from "../model/EditorState";

export const shuffle_brush_polygons_command : ICommandInfoV2 = {
    description: "Shuffle Mesh Polygons",
    exec(state: EditorState){
        return change_selected_brushes(state, shuffle_brush_polygons);
    }
}