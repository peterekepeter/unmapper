import { InteractionRenderState } from "../controller/interactions/InteractionRenderState";
import { Actor } from "./Actor";
import { Rotation } from "./Rotation";
import { UnrealMap } from "./UnrealMap";
import { Vector } from "./Vector";
import { ViewportMode } from "./ViewportMode";

export interface ViewportState
{
    center_location: Vector;
    mode: ViewportMode;
    rotation: Rotation;
    zoom_level: number;
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
    editor_layout: number,
    interaction_render_state?: InteractionRenderState,
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
                center_location: Vector.ZERO,
                rotation: Rotation.IDENTITY,
                zoom_level: 0
            },
            {
                mode: ViewportMode.Front,
                center_location: Vector.ZERO,
                rotation: Rotation.IDENTITY,
                zoom_level: 0
            },
            {
                mode: ViewportMode.Perspective,
                center_location: new Vector(-800,-450,500).scale(2),
                rotation: new Rotation(-30,30,0),
                zoom_level: 0
            },
            {
                mode: ViewportMode.Side,
                center_location: Vector.ZERO,
                rotation: Rotation.IDENTITY,
                zoom_level: 0
            },
        ],
        editor_layout: 0,
        interaction_render_state: null
    }
}
