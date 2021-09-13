import { ICommandInfoV2 } from "../../controller/command"
import { ActorSelection, EditorSelection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { replace_selection } from "./replace_selection"

export const toggle_selection_command : ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: toggle_selection,
}

function toggle_selection(
    state: EditorState, 
    selection: EditorSelection,
): EditorState {
    if (state.options.vertex_mode){
        return toggle_selection_vertex_mode(state, selection)
    }
    else {
        return toggle_actor_selection(state, selection)
    }
}

function toggle_actor_selection(
    state: EditorState, 
    to_toggle: EditorSelection,
): EditorState {
    if (to_toggle.actors.length === 0){
        return state
    }
    const result_set: { [key:number]: ActorSelection } = {}
    for (const selection of state.selection.actors){
        result_set[selection.actor_index] = selection
    }
    for (const selection of to_toggle.actors){
        if (result_set[selection.actor_index]) {
            delete result_set[selection.actor_index]
        } else {
            result_set[selection.actor_index] = selection
        }
    }
    const result_list: ActorSelection[] = []
    for (const key in result_set){
        result_list.push(result_set[key])
    }
    return {
        ...state, 
        selection: {
            ...state.selection, 
            actors: result_list, 
        }, 
    }
}

function toggle_selection_vertex_mode(
    state: EditorState, 
    to_toggle: EditorSelection,
): EditorState {
    if (to_toggle.actors.length === 0){
        return state
    }
    const result_list: ActorSelection[] = []
    for (let selection of state.selection.actors){
        const toggle_geometry = to_toggle.actors.find(s => s.actor_index === selection.actor_index)
        if (toggle_geometry){
            selection = toggle_geometry_selection(selection, toggle_geometry)
        }
        result_list.push(selection)
    }
    return replace_selection(state, { ...state.selection, actors: result_list })
}

function toggle_geometry_selection(
    selection: ActorSelection,
    to_toggle: ActorSelection,
): ActorSelection {
    if (selection.actor_index !== to_toggle.actor_index){
        throw new Error("actor indexes should match")
    }
    return { 
        actor_index: selection.actor_index,
        vertexes: toggle_list(selection.vertexes, to_toggle.vertexes),
        edges: toggle_list(selection.edges, to_toggle.edges),
        polygons: toggle_list(selection.polygons, to_toggle.polygons),
        polygon_vertexes: toggle_polygon_vertexes(selection.polygon_vertexes, to_toggle.polygon_vertexes),
    }
}

function toggle_list<T>(a: T[], b: T[]): T[]{
    if (a.length === 0){
        return b
    }
    if (b.length === 0){
        return a
    }
    const result_set = new Set(a)
    for (const i of b){
        if (result_set.has(i)){
            result_set.delete(i)
        } 
        else {
            result_set.add(i)
        }
    }
    return [...result_set]
}

type PV = ActorSelection["polygon_vertexes"][0];

function toggle_polygon_vertexes(selection: PV[], to_toggle: PV[]): PV[] {
    if (selection.length === 0){
        return to_toggle
    }
    if (to_toggle.length === 0){
        return selection
    }
    const result_list: PV[] = []

    for (const item of selection){
        const toggle = to_toggle.find(t => t.polygon_index === item.polygon_index)
        if (!toggle){
            result_list.push(item)
        } else {
            const new_vertexes = toggle_list(item.vertexes, toggle.vertexes)
            const new_edges = toggle_list(item.edges, toggle.edges)
            if (new_vertexes === item.vertexes && new_edges === item.edges){
                result_list.push(item)
            } else if (new_vertexes.length > 0 || new_edges.length > 0) {
                result_list.push({
                    polygon_index: item.polygon_index,
                    vertexes: new_vertexes,
                    edges: new_edges,
                })
            }
        }
    }

    return result_list
}

