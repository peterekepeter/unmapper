import { Actor } from "../Actor"
import { BrushModel } from "../BrushModel"
import { BrushVertex } from "../BrushVertex"
import { EditorState } from "../EditorState"
import { UnrealMap } from "../UnrealMap"
import { Vector } from "../Vector"
import { change_selected_actors } from "./editor_state_change"

export function change_selected_vertexes(a: EditorState, fn: (v: Vector) => Vector): EditorState
export function change_selected_vertexes(a: Actor, fn: (v: Vector) => Vector): Actor
export function change_selected_vertexes(a: BrushModel, fn: (v: Vector) => Vector): BrushModel
export function change_selected_vertexes(subject: unknown, fn: (v: Vector) => Vector): unknown {
    if (subject instanceof Actor) {
        return change_selected_vertexes_for_actor(subject, fn)
    }
    else if (subject instanceof BrushModel) {
        return change_selected_vertexes_for_brush_model(subject, fn)
    } 
    else if ((subject as EditorState).map instanceof UnrealMap) {
        return change_selected_vertexes_for_editor_state(subject as EditorState, fn)
    }
    else {
        throw new Error(`cannot change vertexes of ${subject}`)
    }
}

function change_selected_vertexes_for_editor_state(state: EditorState, fn: (v: Vector) => Vector): EditorState {
    return change_selected_actors(state, a => {
        return change_selected_vertexes_for_actor(a, fn)
    })
}

function change_selected_vertexes_for_actor(a: Actor, fn: (v: Vector) => Vector): Actor {
    if (!a.selected || !a.brushModel) {
        return a
    }
    const new_brush = change_selected_vertexes_for_brush_model(a.brushModel, fn)
    if (new_brush === a.brushModel) {
        return 
    }
    const new_actor = a.shallow_copy()
    new_actor.brushModel = new_brush
    return new_actor
}

function change_selected_vertexes_for_brush_model(
    brush: BrushModel,
    fn: (v: Vector) => Vector
): BrushModel {
    if (!brush) {
        return brush
    }
    const result: BrushVertex[] = []
    let change = false
    for (const vertex of brush.vertexes) {
        if (!vertex.selected) {
            result.push(vertex) // no change
            continue
        }
        const new_vertex = new BrushVertex(fn(vertex.position), vertex.selected)
        if (vertex === new_vertex || (
            vertex.selected === new_vertex.selected &&
            vertex.position.equals(new_vertex.position)
        )) {
            result.push(vertex) // no change
        } else {
            result.push(new_vertex)
            change = true
        }
    }
    if (!change) {
        return brush
    }
    const new_brush = brush.shallow_copy()
    new_brush.vertexes = result
    return new_brush
}