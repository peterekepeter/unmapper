import { BoundingBox } from "../../model/BoundingBox"
import { Vector } from "../../model/Vector"

export interface InteractionRenderState {
    line_from?: Vector;
    line_to?: Vector;
    snap_location?: Vector;
    viewport_box_index?: number;
    viewport_box?: BoundingBox;
    shapes?: DebugShape[];
}

export type DebugShape 
    = { type: 'Point', location: Vector, shape?: 'Dot' | 'Rectangle' | 'X' | 'TinyDot' | 'SmallDot' } 
    | { type: 'Line', from: Vector, to: Vector, shape?: 'Arrow' | 'Line' }
