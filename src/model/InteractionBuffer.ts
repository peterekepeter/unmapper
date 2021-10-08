import { deep_freeze } from "../util/deep_freeze"
import { Vector } from "./Vector"
import { ViewportMode } from "./ViewportMode"

export interface InteractionBuffer
{
    points: Vector[]
    confirmed_points: number;
    viewport_mode: ViewportMode
    scalar: {
        expression: string,
        value: number
    } | null
    axis_lock: {
        x_axis: boolean,
        y_axis: boolean, 
        z_axis: boolean
    }
}

export const DEFAULT_INTERACTION_BUFFER: InteractionBuffer = deep_freeze({
    points: [],
    confirmed_points: 0,
    viewport_mode: ViewportMode.Top,
    scalar: null,
    axis_lock: {
        x_axis: false,
        y_axis: false,
        z_axis: false,
    },
})
