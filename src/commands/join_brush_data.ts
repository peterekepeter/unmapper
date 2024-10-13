import { ICommandInfoV2 } from "../controller/command"
import { BrushModel } from "../model/BrushModel"
import { EditorState } from "../model/EditorState"
import { EditorError } from "../model/error"
import { change_selected_brushes } from "../model/state"
import { pipe } from "../util/pipe"
import { apply_transform_command } from "./apply_transform"
import { apply_transform_center_command } from "./apply_transform_center"



export const join_brush_data_command: ICommandInfoV2 = {
    description: 'Join brush data',
    uses_interaction_buffer: true,
    exec: pipe(
        apply_transform_command.exec,
        join_brush_data,
    ),
}


function join_brush_data(state: EditorState): EditorState {
    const brushes = state.selection.actors
        .map(s => state.map.actors[s.actor_index].brushModel)
        .filter(a => a != null)
    EditorError.if(brushes.length < 2, "Select 2 or more brushes")
    const firstBrush = brushes[0];
    apply_transform_center_command
    return change_selected_brushes(state, (brush) => {
        if (brush !== firstBrush) {
            return null; // delete others
        }
        // keep first brush and merge data into it
        const result = new BrushModel();
        result.name = firstBrush.name;
        for (const merge of brushes) {       
            const offset = result.vertexes.length;     
            result.vertexes = result.vertexes.concat(merge.vertexes);
            result.polygons = result.polygons.concat(merge.polygons.map(p => {
                // rewrite vertex refs;
                const nextpoly = p.shallow_copy();
                nextpoly.vertexes = nextpoly.vertexes.map(v => v + offset);
                return nextpoly;
            }))
        }  
        result.recalculate_median_normal();
        result.rebuild_all_poly_edges();
        return result;
    })
}


