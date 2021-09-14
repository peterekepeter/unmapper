import { Vector } from "./Vector"
import { ViewportMode } from "./ViewportMode"

export interface InteractionBuffer
{
    points: Vector[]
    viewport_mode: ViewportMode
    scalar: number | null
    lock_x: boolean
    lock_y: boolean
    lock_z: boolean
}
