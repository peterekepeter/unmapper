import { EditorError } from "../../model/error/EditorError"
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
        const a = first.subtract_vector(third)
        const b = second.subtract_vector(third)
        const cross_product = Vector.cross_product(a,b)
        if (cross_product.equals(Vector.ZERO)){
            return
        }
        this.result = new Plane(cross_product, second)
        // verify that the points are on the plane
        EditorError.if(Math.abs(this.result.signed_distance_to_point(first))>1e-9)
        EditorError.if(Math.abs(this.result.signed_distance_to_point(second))>1e-9)
        EditorError.if(Math.abs(this.result.signed_distance_to_point(third))>1e-9)
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
                return this.first_point.add_vector(Vector.UNIT_NEGATIVE_Z)
        }
    }
}