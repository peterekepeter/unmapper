import { BoundingBox } from "../../model/BoundingBox"
import { Vector } from "../../model/Vector"

export interface InteractionRenderState {
    line_from?: Vector;
    line_to?: Vector;
    snap_location?: Vector;
    viewport_box_index?: number;
    viewport_box?: BoundingBox;
}
