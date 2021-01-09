import { Actor } from "./Actor";
import { UnrealMap } from "./UnrealMap";
import { Vector } from "./Vector";
import { ViewportMode } from "./ViewportMode";

export interface ViewportState
{
    center_location: Vector
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
    const state = create_initial_editor_state();
    state.map.actors = actors;
    return state;
}

export function create_initial_editor_state() : EditorState{
    return {
        history: {
            get_next_state: () => null,
            get_previous_state: () => null,
        },
        map: new UnrealMap(),
        vertex_mode: false,
        viewports: [
            {
                mode: ViewportMode.Top,
                center_location: Vector.ZERO
            },
            {
                mode: ViewportMode.Front,
                center_location: Vector.ZERO
            },
            {
                mode: ViewportMode.Perspective,
                center_location: new Vector(-500,-300,300)
            },
            {
                mode: ViewportMode.Side,
                center_location: Vector.ZERO
            },
        ]
    }
}
