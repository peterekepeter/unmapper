import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent";
import { ViewportMode } from "../../model/ViewportMode"
import { FromToInteraction } from "./FromToInteraction";
import { Interaction } from "./Interaction"
import { InteractionRenderState } from "./InteractionRenderState"

export class VectorInteraction implements Interaction<Vector>
{
    from_to = new FromToInteraction();

    set_pointer_world_location(location: Vector, event: ViewportEvent): void {
        this.from_to.set_pointer_world_location(location, event)
    }

    pointer_click(): void {
        this.from_to.pointer_click()
    }

    get render_state(): InteractionRenderState {
        return this.from_to.render_state
    }

    get finished(): boolean {
        return this.from_to.finished
    }

    get result(): Vector {
        const result = this.from_to.result
        if (result.to == null){
            return Vector.ZERO
        }
        return result.to.subtract_vector(result.from)
    }
    
    static factory = (): Interaction => new VectorInteraction();
}

