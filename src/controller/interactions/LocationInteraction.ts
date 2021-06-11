import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { Interaction } from "./Interaction"
import { InteractionRenderState } from "./InteractionRenderState"

export class LocationInteraction implements Interaction<Vector>
{
    set_pointer_world_location(
        location: Vector,
        event: ViewportEvent
    ): void {
        this.result = location
    }

    pointer_click(): void {
        this.finished = true
    }

    result: Vector;
    finished: boolean;
    render_state: InteractionRenderState;

    static factory = (): Interaction => new LocationInteraction();

}