import { Rotation } from "./Rotation";
import { Vector } from "./Vector"

export class PivotRotation {

    static IDENTITY: PivotRotation = new PivotRotation(Vector.ZERO, Rotation.IDENTITY)

    constructor(
        public pivot: Vector,
        public rotation: Rotation
    ) { }

    to_transform_fn() : (v:Vector) => Vector {
        const M = this.rotation.to_matrix()
        const p = this.pivot
        return (v: Vector) => M.apply(v.subtract_vector(p)).add_vector(p)
    }

}