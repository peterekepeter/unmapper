import { Rotation } from "./Rotation";
import { Vector } from "./Vector"

export class PivotRotation {

    static IDENTITY: PivotRotation = new PivotRotation(Vector.ZERO, Rotation.IDENTITY)

    constructor(
        public pivot: Vector,
        public rotation: Rotation
    ) { }

}