import { Vector } from "../../model/Vector"
import { ViewportMode } from "../../model/ViewportMode"
import { Interaction } from "./Interaction"
import { InteractionRenderState } from "./InteractionRenderState"

export class PlaneInteraction implements Interaction<Vector>
{
    set_pointer_world_location(location: Vector, view_mode: ViewportMode): void {
        throw new Error("Method not implemented.")
    }
    pointer_click(): void {
        throw new Error("Method not implemented.")
    }
    result: Vector
    finished: boolean
    render_state: InteractionRenderState
    
}