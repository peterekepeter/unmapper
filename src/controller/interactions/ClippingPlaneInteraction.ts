import { Plane } from "../../model/Plane"
import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { ViewportMode } from "../../model/ViewportMode"
import { Interaction } from "./Interaction"
import { InteractionRenderState } from "./InteractionRenderState"

export class ClippingPlaneInteraction implements Interaction<Plane>
{
    result: Plane
    finished: boolean
    render_state: InteractionRenderState

    static factory = (): Interaction => new ClippingPlaneInteraction();

    private expecting_second_point = false;
    private first_point = Vector.ZERO;

    set_pointer_world_location(location: Vector, event: ViewportEvent): void {
        if (!this.expecting_second_point) {
            this.first_point = location
            return
        }
        const first = this.first_point
        const second = location
        const third = this._get_third_point(event)
        const normal = first.subtract_vector(second).cross(first.subtract_vector(third)).normalize()
        this.result = new Plane(normal, second)
        this.render_state = {
            line_from: first,
            line_to: second
        }
    }

    pointer_click(): void {
        if (!this.expecting_second_point) {
            this.expecting_second_point = true
        } else {
            this.finished = true
        }
    }

    private _get_third_point(event: ViewportEvent) {
        switch (event.view_mode) {
            case ViewportMode.Perspective:
                return event.view_transform.view_center
            case ViewportMode.Front:
                return this.first_point.add_vector(Vector.UNIT_X)
            case ViewportMode.Side:
                return this.first_point.add_vector(Vector.UNIT_Y)
            case ViewportMode.Top:
            case ViewportMode.UV:
                return this.first_point.add_vector(Vector.UNIT_Z)
        }
    }
}