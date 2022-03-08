import { Actor } from "../Actor"
import { calculate_polygon_median } from "../algorithms/calculate_polygon_median"
import { calculate_polygon_normal } from "../algorithms/calculate_polygon_normal"
import { BrushModel } from "../BrushModel"
import { BrushVertex } from "../BrushVertex"
import { EditorState } from "../EditorState"
import { Vector } from "../Vector"
import { change_selected_actors } from "./change_selected_actors"

type VertexFunction = (v: Vector, index: number, brush: BrushModel, actor: Actor) => Vector

export function change_selected_vertexes(a: EditorState, fn: VertexFunction): EditorState
export function change_selected_vertexes(a: Actor, selected_vertexes: number[], fn: VertexFunction): Actor
export function change_selected_vertexes(a: BrushModel, selected_vertexes: number[], fn: VertexFunction): BrushModel
export function change_selected_vertexes(subject: unknown, b: VertexFunction | number[], c?: VertexFunction): unknown {
    if (subject instanceof Actor && b instanceof Array && typeof c === 'function') {
        return change_selected_vertexes_for_actor(subject, b, c)
    }
    else if (subject instanceof BrushModel && b instanceof Array && typeof c === 'function') {
        return change_selected_vertexes_for_brush_model(null, subject, b, c)
    } 
    else if ((subject as EditorState).map != null && typeof b === 'function') {
        return change_selected_vertexes_for_editor_state(subject as EditorState, b)
    }
    else {
        throw new Error(`cannot change vertexes of ${subject} invalid args: ` + JSON.stringify({ b, c }))
    }
}

function change_selected_vertexes_for_editor_state(state: EditorState, fn: VertexFunction): EditorState {
    return change_selected_actors(state, (actor, selected) => {
        return change_selected_vertexes_for_actor(actor, selected.vertexes, fn)
    })
}
  
function change_selected_vertexes_for_actor(a: Actor, vertexes: number[], fn: VertexFunction): Actor {
    if (!vertexes || !a.brushModel) {
        return a
    }
    const new_brush = change_selected_vertexes_for_brush_model(a, a.brushModel, vertexes, fn)
    if (new_brush === a.brushModel) {
        return a
    }
    const new_actor = a.shallow_copy()
    new_actor.brushModel = new_brush
    return new_actor
}

function change_selected_vertexes_for_brush_model(
    actor: Actor,
    brush: BrushModel,
    vertexes: number[],
    fn: VertexFunction,
): BrushModel {
    if (!brush) {
        return brush
    }
    const new_vertex_list: BrushVertex[] = [...brush.vertexes]
    let change = false
    for (const selected_index of vertexes) {
        const vertex = new_vertex_list[selected_index]
        const new_position = fn(vertex.position, selected_index, brush, actor)
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
    new_brush.polygons = new_brush.polygons.map(p => {
        const center_point = calculate_polygon_median(new_vertex_list, p)
        const normal = calculate_polygon_normal(new_vertex_list, p)
        if (!center_point.equals(p.median) || !normal.equals(p.normal)){
            p = p.shallow_copy()
            p.median = center_point
            p.normal = normal
        }
        return p
    })
    return new_brush
}
