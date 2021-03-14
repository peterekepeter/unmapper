import { Vector } from "../../model/Vector";
import { ViewportMode } from "../../model/ViewportMode";
import { Interaction } from "./Interaction";
import { ViewportVectorAdjustment } from "./interaction-helpers";
import { InteractionRenderState } from "./InteractionRenderState";

export class FromTo {
    constructor(
        public from: Vector,
        public to: Vector
    ) {
        Object.freeze(this)
    }
}

export class FromToInteraction implements Interaction<FromTo>
{
    private pointer_from: Vector = Vector.ZERO
    private pointer_to: Vector = null
    private state: 'from' | 'to' | 'done' = 'from'

    set_pointer_world_location(location: Vector, view_mode: ViewportMode = ViewportMode.Perspective): void {
        switch (this.state) {
            case "from":
                this.pointer_from = location
                break
            case "to":
                this.pointer_to = new ViewportVectorAdjustment(this.pointer_from, view_mode)
                    .adjust(location)
                break
        }
    }

    pointer_click(): void {
        this.next_state()
    }

    private next_state() {
        switch (this.state) {
            case "from":
                this.state = "to"
                break
            case "to":
                this.state = "done"
                break
        }
    }

    get render_state(): InteractionRenderState {
        if (this.state === "to") {
            return {
                line_from: this.pointer_from,
                line_to: this.pointer_to
            }
        }
        return null
    }

    get result(): FromTo {
        return {
            from: this.pointer_from,
            to: this.pointer_to
        }
    }

    get finished(): boolean {
        return this.state === "done"
    }

    static factory = (): Interaction => new FromToInteraction()

}

