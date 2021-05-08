import { ICommandInfoV2 } from "../../controller/command";
import { Actor } from "../../model/Actor";
import { change_actors } from "../../model/algorithms/editor_state_change";
import { EditorState } from "../../model/EditorState";

export const select_vertex_command: ICommandInfoV2 = {
    exec: select_vertex
}

export function select_vertex(state: EditorState, target: Actor, vertexIndex: number): EditorState {
    return change_actors(state, actor => {
        const brush = actor.brushModel;
        if (!brush) {
            return actor;
        }
        if (target === actor && brush.vertexes[vertexIndex].selected
            || target !== actor && brush.vertexes.findIndex(v => v.selected) === -1) {
            return actor;
        }
        const new_brush = actor.brushModel.shallowCopy();
        new_brush.vertexes = brush.vertexes.map((vertex, index) => {
            const should_be_selected = target === actor && index === vertexIndex;
            if (should_be_selected !== vertex.selected) {
                const new_vertex = vertex.shallowCopy();
                new_vertex.selected = should_be_selected;
                return new_vertex;
            } else {
                return vertex;
            }
        });
        const new_actor = actor.shallow_copy();
        new_actor.brushModel = new_brush;
        return new_actor;
    })
}