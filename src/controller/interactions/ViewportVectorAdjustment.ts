import { Vector } from "../../model/Vector"
import { ViewportMode } from "../../model/ViewportMode"

export class ViewportVectorAdjustment {

    constructor(private reference_vector: Vector, private view_mode: ViewportMode) { }

    adjust(vector_to_adjust: Vector): Vector {
        const v = vector_to_adjust
        const ref = this.reference_vector
        switch (this.view_mode) {
            case ViewportMode.UV:
            case ViewportMode.Top:
                return new Vector(v.x, v.y, ref.z)
            case ViewportMode.Front:
                return new Vector(ref.x, v.y, v.z)
            case ViewportMode.Side:
                return new Vector(v.x, ref.y, v.z)
            default:
            case ViewportMode.Perspective:
                return v
        }
    }
    
}
