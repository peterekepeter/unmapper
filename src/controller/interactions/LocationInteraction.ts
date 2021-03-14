import { Vector } from "../../model/Vector";
import { ViewportMode } from "../../model/ViewportMode";
import { Interaction } from "./Interaction";
import { InteractionRenderState } from "./InteractionRenderState";

export class LocationInteraction implements Interaction<Vector>
{
    set_pointer_world_location(
        location: Vector,
        view_mode: ViewportMode = ViewportMode.Perspective
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