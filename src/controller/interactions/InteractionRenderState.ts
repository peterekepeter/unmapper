import { Vector } from "../../model/Vector";

export interface InteractionRenderState {
    line_from?: Vector;
    line_to?: Vector;
    snap_location?: Vector;
}
