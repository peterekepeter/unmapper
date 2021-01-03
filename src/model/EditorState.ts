import { Actor } from "./Actor";
import { UnrealMap } from "./UnrealMap";
import { Vector } from "./Vector";
import { ViewportMode } from "./ViewportMode";

export interface ViewportState
{
    center: Vector
    mode: ViewportMode
}

export interface IHistoryStateAccess
{
    get_next_state(): EditorState;
    get_previous_state(): EditorState;
}

export interface EditorState
{
    map: UnrealMap;
    viewports: ViewportState[];
    history: IHistoryStateAccess;
    vertex_mode: boolean;
}

export function editor_state_from_actors(actors: Actor[]) : EditorState {
    return {
        map: {
            actors: actors
        },
        vertex_mode: false,
        viewports: [],
        history: {
            get_next_state: () => null,
            get_previous_state: () => null
        }
    }
}