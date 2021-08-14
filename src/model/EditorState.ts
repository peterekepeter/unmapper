import { InteractionRenderState } from "../controller/interactions/InteractionRenderState"
import { Actor } from "./Actor"
import { DEFAULT_EDITOR_SELECTION, EditorSelection } from "./EditorSelection"
import { PanelLayout, PanelSplitDirection, PanelType } from "./layout/PanelLayout"
import { Rotation } from "./Rotation"
import { UnrealMap } from "./UnrealMap"
import { Vector } from "./Vector"
import { ViewportMode } from "./ViewportMode"

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

export interface EditorOptions {
    vertex_mode: boolean;
    preserve_vertex_uv: boolean;
    editor_layout: number;
    box_select_mode: boolean;
    layout: PanelLayout
}

export interface EditorState
{
    map: UnrealMap;
    viewports: ViewportState[];
    history: IHistoryStateAccess;
    options: EditorOptions;
    interaction_render_state?: InteractionRenderState,
    status: StatusInfo,
    selection: EditorSelection
}

export interface StatusInfo
{
    message: string | null,
    is_error: boolean
}

export function editor_state_from_actors(actors: Actor[]) : EditorState {
    const state = create_initial_editor_state()
    state.map.actors = actors
    return state
}

export function create_initial_editor_state() : EditorState{
    return {
        history: {
            get_next_state: () => null,
            get_previous_state: () => null,
        },
        map: new UnrealMap(),
        options: {
            vertex_mode: false,
            preserve_vertex_uv: false,
            editor_layout: 0,
            box_select_mode: false,
            layout: {
                split_direction: PanelSplitDirection.Horizontal,
                split_percentage: 0.2,
                left_child: {
                    split_direction: PanelSplitDirection.Vertical,
                    split_percentage: 0.5,
                    left_child: PanelType.Objects,
                    right_child: PanelType.Properties
                },
                right_child: {
                    split_direction: PanelSplitDirection.Horizontal,
                    split_percentage: 0.66,
                    left_child: {
                        split_direction: PanelSplitDirection.Vertical,
                        split_percentage: 0.5,
                        left_child: PanelType.Viewport, 
                        right_child: PanelType.Viewport
                    },
                    right_child: { 
                        split_direction: PanelSplitDirection.Vertical,
                        split_percentage: 0.5,
                        left_child: PanelType.Viewport,
                        right_child: PanelType.Viewport
                    }
                }
            }
        },
        viewports: [
            {
                mode: ViewportMode.Top,
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
                mode: ViewportMode.Front,
                center_location: Vector.ZERO,
                rotation: Rotation.IDENTITY,
                zoom_level: 0
            },
            {
                mode: ViewportMode.Side,
                center_location: Vector.ZERO,
                rotation: Rotation.IDENTITY,
                zoom_level: 0
            },
        ],
        interaction_render_state: null,
        status: {
            is_error: false,
            message: null
        },
        selection: DEFAULT_EDITOR_SELECTION
    }
}

export function get_actor_index(state: EditorState, target: Actor): number
{
    const index = state.map.actors.indexOf(target)
    if (index === -1){
        throw new Error("actor was not found in the given state")
    }
    return index
}
