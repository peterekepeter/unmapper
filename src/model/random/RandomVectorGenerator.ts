import { BoundingBox } from "../BoundingBox"
import { EditorError } from "../error/EditorError"
import { Vector } from "../Vector"
import { FixedLCGenerator } from "./FixedLCGenerator"
import { RandomGeneratorCore } from "./RandomGeneratorCore"

export class RandomVectorGenerator {

    constructor(private core: RandomGeneratorCore = new FixedLCGenerator()) {
        EditorError.if(core.min_value_inclusive !== 0)
    }

    set seed(value: number) { this.core.seed = value }

    private _next_float() {
        return this.core.generate_next_value()
            / (this.core.max_value_exclusive - 1)
    }

    private _next_signed_float() {
        return this.core.generate_next_value()
            / (this.core.max_value_exclusive - 1) * 2 - 1
    }

    next_vector_from_unit_disk(): Vector {
        let x = 0, y = 0
        for (let i = 0; i < 16; i++) {
            x = this._next_signed_float()
            y = this._next_signed_float()
            if (x * x + y * y < 1) { break }
        }
        return new Vector(x, y, 0)
    }

    next_vector_from_unit_circle(): Vector {
        let x = 0, y = 0, length_squared
        for (let i = 0; i < 16; i++) {
            x = this._next_signed_float()
            y = this._next_signed_float()
            length_squared = x * x + y * y
            if (length_squared < 1 && length_squared !== 0) { break }
        }
        const length = Math.sqrt(length_squared)
        return new Vector(x / length, y / length, 0)
    }

    next_vector_from_unit_sphere_volume(): Vector {
        let x = 0, y = 0, z = 0
        for (let i = 0; i < 16; i++) {
            x = this._next_signed_float()
            y = this._next_signed_float()
            z = this._next_signed_float()
            if (x * x + y * y + z * z < 1) { break }
        }
        return new Vector(x, y, 0)
    }

    next_vector_from_unit_sphere_surface(): Vector {
        let x = 0, y = 0, z = 0, length_squared
        for (let i = 0; i < 16; i++) {
            x = this._next_signed_float()
            y = this._next_signed_float()
            z = this._next_signed_float()
            length_squared = x * x + y * y + z * z
            if (length_squared < 1 && length_squared !== 0) { break }
        }
        const length = Math.sqrt(length_squared)
        return new Vector(x / length, y / length, z / length)
    }

    next_vector_from_bounding_box(box: BoundingBox): Vector {
        const x = this._next_float() * (box.max_x - box.min_x) + box.min_x
        const y = this._next_float() * (box.max_y - box.min_y) + box.min_y
        const z = this._next_float() * (box.max_z - box.min_z) + box.min_z
        return new Vector(x, y, z)
    }

}
