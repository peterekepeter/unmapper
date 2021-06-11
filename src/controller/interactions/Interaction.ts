import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { InteractionRenderState } from "./InteractionRenderState"

export interface Interaction<T = unknown> {

    set_pointer_world_location(location: Vector, event: ViewportEvent): void,
    pointer_click(): void,
    
    readonly result: T
    readonly finished: boolean;
    
    /** @deprecated commands should generate the render state */
    readonly render_state: InteractionRenderState,
    
}
