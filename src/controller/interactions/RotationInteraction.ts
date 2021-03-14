import { decompose_matrix_rotation } from "../../model/geometry/decompose-matrix"
import { vector_to_vector_rotation_matrix } from "../../model/geometry/vector-rotation"
import { PivotRotation } from "../../model/PivotRotation"
import { Rotation } from "../../model/Rotation"
import { Vector } from "../../model/Vector"
import { ViewportMode } from "../../model/ViewportMode"
import { Interaction } from "./Interaction"
import { ViewportVectorAdjustment } from "./interaction-helpers"
import { InteractionRenderState } from "./InteractionRenderState"

export class RotationInteraction implements Interaction<PivotRotation>
{
    private state: 'center' | 'from' | 'to' | 'done' = 'center';
    pivot: Vector;
    from: Vector;
    to: Vector;
    result: PivotRotation = PivotRotation.IDENTITY
    finished: boolean;

    set_pointer_world_location(location: Vector, view_mode: ViewportMode): void {
        switch (this.state) {
            case "center":
                this.pivot = location
                this.result = new PivotRotation(this.pivot, Rotation.IDENTITY)
                break
            case "from":
                this.from = location
                break
            case "to":
                this.to = location
                this.calulate_result(view_mode)
                break
        }
    }

    pointer_click(): void {
        switch (this.state){
            case "center": 
                this.state = "from"
                break
            case "from": 
                this.state = "to"
                break
            case "to":
                this.state = 'done'
                this.finished = true
                break
        }
    }

    get render_state(): InteractionRenderState{
        switch (this.state){
            case 'from':
                return { line_from: this.pivot, line_to: this.from }
            case 'to':
                return { line_from: this.from, line_to: this.to }
        }
        return {}
    }

    private calulate_result(view_mode: ViewportMode): void {
        const rotation_center = this.pivot
        const adjustment = new ViewportVectorAdjustment(rotation_center, view_mode)
        const from = adjustment.adjust(this.from).subtract_vector(this.pivot)
        const to = adjustment.adjust(this.to).subtract_vector(this.pivot)
        const rotation_matrix = vector_to_vector_rotation_matrix(from, to)
        const rotation = decompose_matrix_rotation(rotation_matrix)[0]
        this.result = new PivotRotation(this.pivot, rotation)
    }

    static factory = () : Interaction => new RotationInteraction()

}