import { Vector } from "../../model/Vector"
import { IInteractionRenderState } from "./IInteractionRenderState"

export interface IInteraction<T = unknown> {

    set_pointer_world_location(location: Vector): void,
    pointer_click(): void,
    
    readonly render_state: IInteractionRenderState,
    readonly result: T
    readonly finished: boolean;
    
}
