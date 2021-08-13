import { Actor } from "../Actor"
import { BrushModel } from "../BrushModel"
import { EditorSelection } from "../EditorSelection"
import { EditorState } from "../EditorState"
import { change_selected_actors } from "./change_selected_actors"


export function change_selected_brushes(
    state: EditorState,
    brush_fn: (brush: BrushModel, actor: Actor, selection: EditorSelection["actors"][0]) => BrushModel
): EditorState {
    return change_selected_actors(state, (actor, selection) => {
        if (!actor.brushModel) {
            return actor
        }
        const new_brush = brush_fn(actor.brushModel, actor, selection)
        if (!new_brush) {
            throw new Error('unexpected null brush result')
        }
        if (new_brush === actor.brushModel) {
            return actor
        } else {
            const new_actor = actor.shallow_copy()
            new_actor.brushModel = new_brush
            return new_actor
        }
    })
}
