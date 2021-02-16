import { ICommandInfoV2 } from "../../controller/command_registry";
import { Actor } from "../../model/Actor";
import { change_actors } from "../../model/algorithms/editor_state_change";
import { BrushModel } from "../../model/BrushModel";
import { EditorState } from "../../model/EditorState";


export const select_toggle_vertex_command: ICommandInfoV2 = {
    exec: select_toggle_vertex
}

function select_toggle_vertex(state: EditorState, target: Actor, vertexIndex : number): EditorState
{
    return change_actors(state, actor => {
        const old_brush = actor.brushModel;
        let new_brush : BrushModel = null;
        if (!old_brush){
            return actor;
        }
        if (actor === target && target.selected) {
            // select target vertex
            new_brush = target.brushModel.shallowCopy();
            new_brush.vertexes = old_brush.vertexes.map((vertex, index) => {
                if (index === vertexIndex){
                    const new_vertex = vertex.shallowCopy();
                    new_vertex.selected = !vertex.selected;
                    return new_vertex;
                } else {
                    return vertex;
                }
            })
        }
        // TODO: deselect vertexes of not selected models
        if (new_brush != null) {
            const new_actor = actor.shallow_copy();
            new_actor.brushModel = new_brush;
            return new_actor;
        } else {
            return actor;
        }
    })
}
