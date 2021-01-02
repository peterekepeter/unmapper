import { Actor } from "./Actor";
import { UnrealMap } from "./UnrealMap";
import { Vector } from "./Vector";
import { ViewportMode } from "./ViewportMode";

export class ViewportState
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
