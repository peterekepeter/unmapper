import { Actor } from "../Actor"
import { BrushModel } from "../BrushModel"
import { EditorSelection } from "../EditorSelection"
import { EditorState } from "../EditorState"
import { change_selected_actors } from "./change_selected_actors"

export type BrushChangeResult = BrushModel[]|BrushModel|null|undefined

export type BrushChangeFn = (brush: BrushModel, actor: Actor, selection: EditorSelection["actors"][0]) => BrushChangeResult

export function change_selected_brushes(
    state: EditorState,
    brush_fn: BrushChangeFn
): EditorState {
    return change_selected_actors(state, (actor, selection) => {
        if (!actor.brushModel) {
            return actor
        }
        let result = brush_fn(actor.brushModel, actor, selection)

        if (!result) {
            return null;
        }
        
        const arr: BrushModel[]|BrushModel = result
        if (arr instanceof Array) {
            if (arr.length === 0) {
                return null;
            }
            else if (arr.length === 1) {
                return change_actor_brush(actor, arr[0]);
            }
            else {
                return arr.map(b => change_actor_brush(actor, b));
            }
        }

        const brush: BrushModel = arr;
        return change_actor_brush(actor, brush);
    })
}

function change_actor_brush(a: Actor, b: BrushModel): Actor {
    if (a.brushModel === b) {
        return a;
    }
    a = a.shallow_copy();
    a.brushModel = b;
    return a;
}