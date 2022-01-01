import { Actor } from "../Actor"
import { BrushModel } from "../BrushModel"
import { BrushVertex } from "../BrushVertex"
import { EditorState } from "../EditorState"
import { change_selected_actors } from "../state"
import { UnrealMap } from "../UnrealMap"
import { Vector } from "../Vector"

export function change_selected_vertexes(a: EditorState, fn: (v: Vector) => Vector): EditorState
export function change_selected_vertexes(a: Actor, selected_vertexes: number[], fn: (v: Vector) => Vector): Actor
export function change_selected_vertexes(a: BrushModel, selected_vertexes: number[], fn: (v: Vector) => Vector): BrushModel
export function change_selected_vertexes(subject: unknown, b: ((v: Vector) => Vector) | number[], c?: (v: Vector) => Vector): unknown {
    if (subject instanceof Actor && b instanceof Array && typeof c === 'function') {
        return change_selected_vertexes_for_actor(subject, b, c)
    }
    else if (subject instanceof BrushModel && b instanceof Array && typeof c === 'function') {
        return change_selected_vertexes_for_brush_model(subject, b, c)
    } 
    else if ((subject as EditorState).map instanceof UnrealMap && typeof b === 'function') {
        return change_selected_vertexes_for_editor_state(subject as EditorState, b)
    }
    else {
        throw new Error(`cannot change vertexes of ${subject}`)
    }
}

function change_selected_vertexes_for_editor_state(state: EditorState, fn: (v: Vector) => Vector): EditorState {
    return change_selected_actors(state, (actor, selected) => {
        return change_selected_vertexes_for_actor(actor, selected.vertexes, fn)
    })
}
  
function change_selected_vertexes_for_actor(a: Actor, vertexes: number[], fn: (v: Vector) => Vector): Actor {
    if (!vertexes || !a.brushModel) {
        return a
    }
    const new_brush = change_selected_vertexes_for_brush_model(a.brushModel, vertexes, fn)
    if (new_brush === a.brushModel) {
        return a
    }
    const new_actor = a.shallow_copy()
    new_actor.brushModel = new_brush
    return new_actor
}

function change_selected_vertexes_for_brush_model(
    brush: BrushModel, 
    vertexes: number[],
    fn: (v: Vector) => Vector,
): BrushModel {
    if (!brush) {
        return brush
    }
    const new_vertex_list: BrushVertex[] = [...brush.vertexes]
    let change = false
    for (const selected_index of vertexes) {
        const vertex = new_vertex_list[selected_index]
        const new_position = fn(vertex.position)
        if (new_position.equals(vertex.position)){
            continue
        }
        new_vertex_list[selected_index] = new BrushVertex(new_position)
        change = true
    }
    if (!change) {
        return brush
    }
    const new_brush = brush.shallow_copy()
    new_brush.vertexes = new_vertex_list
    return new_brush
}
