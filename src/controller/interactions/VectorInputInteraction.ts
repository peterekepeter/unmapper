import { Vector } from "../../model/Vector";

export class VectorInputInteraction
{
    private pointer_from: Vector = Vector.ZERO;
    private pointer_to: Vector = Vector.ZERO;
    private _result: Vector = Vector.ZERO;
    private state: 'from' | 'to' | 'done' = 'from';
    
    set_pointer_world_location(location: Vector): void {
        switch (this.state){
            case "from":
                this.pointer_from = location
                break
            case "to":
                this.pointer_to = location
                this._result = this.pointer_to.subtract_vector(this.pointer_from)
                break
        }
    }

    pointer_click(): void {
        this.next_state()
    }

    private next_state() {
        switch (this.state){
            case "from":
                this.state = "to"
                break
            case "to":
                this.state = "done"
                break
        }
    }

    get render_state(): IInteractionRenderState
    {
        if (this.pointer_from && this.pointer_to){
            return {
                line_from: this.pointer_from,
                line_to: this.pointer_to
            }
        }
        return null
    }

    get result(): Vector {
        return this._result
    }

    get finished(): boolean {
        return this.state === "done"
    }

}

interface IInteractionRenderState {
    line_from?: Vector
    line_to?: Vector
}