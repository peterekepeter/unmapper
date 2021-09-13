import { deep_freeze } from "../util/deep_freeze"

export interface EditorSelection {
    actors: ActorSelection[];
}

const EMPTY_LIST = deep_freeze([])

export const DEFAULT_EDITOR_SELECTION: EditorSelection = { actors: EMPTY_LIST }

deep_freeze(DEFAULT_EDITOR_SELECTION)

export interface ActorSelection 
{
    actor_index: number;
    vertexes: number[];
    edges: number[];
    polygons: number[];

    polygon_vertexes: {
        // used for selected a vertex online inside a polygon
        // used for selecting vertexes in UV mode
        polygon_index: number;
        vertexes: number[];
        edges: number[];
    }[];
}

export const DEFAULT_ACTOR_SELECTION: ActorSelection = {
    actor_index: -1,
    vertexes: EMPTY_LIST,
    edges: EMPTY_LIST,
    polygons: EMPTY_LIST,
    polygon_vertexes: EMPTY_LIST,
}

export const DEFAULT_ACTOR_POLYGON_SELECTION: ActorSelection['polygon_vertexes'][0] = {
    edges: EMPTY_LIST,
    polygon_index: -1,
    vertexes: EMPTY_LIST,
}

export function create_actor_selection(actor_index: number): ActorSelection {
    return {
        ...DEFAULT_ACTOR_SELECTION,
        actor_index,
    }
}

deep_freeze(DEFAULT_ACTOR_SELECTION)

export function has_no_geometry_selection(selected_actor: ActorSelection): boolean {
    if (selected_actor.vertexes.length > 0) return false
    if (selected_actor.edges.length > 0) return false
    if (selected_actor.polygons.length > 0) return false
    if (selected_actor.polygon_vertexes.length > 0) {
        for (const in_polygon_selection of selected_actor.polygon_vertexes){
            if (in_polygon_selection.vertexes.length > 0) return false
        }
    }
    return true
}
