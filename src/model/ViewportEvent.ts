import { Renderer } from "../render/Renderer"
import { ViewTransform } from "../render/ViewTransform"
import { ViewportMode } from "./ViewportMode"


export interface ViewportEvent
{
    canvas_x: number;
    canvas_y: number;
    viewport_index: number;
    renderer: Renderer;
    view_transform: ViewTransform;
    ctrl_key: boolean;
    view_mode: ViewportMode;
}