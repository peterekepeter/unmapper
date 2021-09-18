import { Vector } from "../../../model/Vector"
import { ViewportEvent } from "../../../model/ViewportEvent"
import { InteractionRenderState } from "../InteractionRenderState"
import { StatefulInteraction } from "./StatefulInteraction"

export class LocationInteraction implements StatefulInteraction<Vector>
{
    set_pointer_world_location(
        location: Vector,
        event: ViewportEvent,
    ): void {
        this.result = location
    }

    pointer_click(): void {
        this.finished = true
    }

    result: Vector;
    finished: boolean;
    render_state: InteractionRenderState;

    static factory = (): StatefulInteraction => new LocationInteraction();

}
