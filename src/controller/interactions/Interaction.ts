import { Vector } from "../../model/Vector"
import { ViewportMode } from "../../model/ViewportMode"
import { InteractionRenderState } from "./InteractionRenderState"

export interface Interaction<T = unknown> {

    set_pointer_world_location(location: Vector, view_mode: ViewportMode): void,
    pointer_click(): void,
    
    readonly render_state: InteractionRenderState,
    readonly result: T
    readonly finished: boolean;
    
}
