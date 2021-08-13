import { deep_freeze } from "../util/deep_freeze"


export interface EditorSelection {
    actors: ActorSelection[];
}

const EMPTY_LIST = deep_freeze([])

export const DEFAULT_EDITOR_SELECTION: EditorSelection = {
    actors: EMPTY_LIST
}

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
    }[];
}

export const DEFAULT_ACTOR_SELECTION: ActorSelection = {
    actor_index: -1,
    vertexes: EMPTY_LIST,
    edges: EMPTY_LIST,
    polygons: EMPTY_LIST,
    polygon_vertexes: EMPTY_LIST
}

export function create_actor_selection(actor_index: number): ActorSelection {
    return {
        ...DEFAULT_ACTOR_SELECTION,
        actor_index
    }
}

deep_freeze(DEFAULT_ACTOR_SELECTION)

