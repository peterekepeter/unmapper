/** 
 * Representation of a vector in 3D space 
 * @todo moving to snake_case
 * @todo moving to vector ops by default, number op secondary
*/
export class Vector {

    x: number
    y: number
    z: number

    static ZERO: Vector = new Vector(0, 0, 0)
    static ONES: Vector = new Vector(1, 1, 1)
    static NEGATIVE_ONES: Vector = new Vector(-1, -1, -1)

    static FORWARD: Vector = new Vector(1, 0, 0)
    static RIGHT: Vector = new Vector(0, 1, 0)
    static UP: Vector = new Vector(0, 0, 1)

    static UNIT_X: Vector = new Vector(1, 0, 0)
    static UNIT_Y: Vector = new Vector(0, 1, 0)
    static UNIT_Z: Vector = new Vector(0, 0, 1)

    static BACKWARD: Vector = new Vector(-1, 0, 0)
    static LEFT: Vector = new Vector(0, -1, 0)
    static DOWN: Vector = new Vector(0, 0, -1)

    static UNIT_NEGATIVE_X: Vector = new Vector(-1, 0, 0)
    static UNIT_NEGATIVE_Y: Vector = new Vector(0, -1, 0)
    static UNIT_NEGATIVE_Z: Vector = new Vector(0, 0, -1)

    static NEGATIVE_INFINITY = new Vector(-Infinity, -Infinity, -Infinity)
    static INFINITY = new Vector(Infinity, Infinity, Infinity)

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
        Object.freeze(this)
    }

    get_component(index: number): number {
        switch(index){
            case 0: return this.x
            case 1: return this.y
            case 2: return this.z
            default: throw new Error('invalid index, it must be 0, 1 or 2')
        }
    }

    add_vector(v: Vector): Vector {
        return this.add_numbers(v.x, v.y, v.z)
    }

    add_numbers(x: number, y: number, z: number): Vector {
        return new Vector(this.x + x, this.y + y, this.z + z)
    }
    subtract_numbers(x: number, y: number, z: number): Vector {
        return new Vector(this.x - x, this.y - y, this.z - z)
    }

    reverse_subtract(x: number, y: number, z: number): Vector {
        return new Vector(x - this.x, y - this.y, z - this.z)
    }

    subtract_vector(v: Vector): Vector {
        return this.subtract(v.x, v.y, v.z)
    }

    scale(s: number): Vector {
        return new Vector(this.x * s, this.y * s, this.z * s)
    }
    
    scale_components(s: Vector): Vector {
        return new Vector(this.x * s.x, this.y * s.y, this.z * s.z)
    }

    dot(v: Vector): number {
        return Vector.dot_product(this, v)
    }

    cross(v: Vector): Vector {
        return Vector.cross_product(this, v)
    }

    normalize(): Vector {
        const length_squared = this.dot(this)
        if (length_squared === 1) {
            return this
        }
        const length = Math.sqrt(length_squared)
        return new Vector(this.x / length, this.y / length, this.z / length)
    }

    length(): number {
        const length_squared = this.dot(this)
        return Math.sqrt(length_squared) 
    }

    distance_to(other: Vector): number {
        const dx = other.x - this.x
        const dy = other.y - this.y
        const dz = other.z - this.z
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    vector_to(x: number, y: number, z:number) : Vector {
        return this.reverse_subtract(x,y,z)
    }

    vector_to_vector(other:Vector) : Vector {
        return other.subtract_vector(this)
    }

    static from_array(array: number[], index = 0): Vector {
        return new Vector(array[index + 0], array[index + 1], array[index + 2])
    }

    static cross_product(a: Vector, b: Vector): Vector {
        return Vector.cross_product_numbers(a.x, a.y, a.z, b.x, b.y, b.z)
    }

    static cross_product_numbers(
        a1: number, a2: number, a3: number,
        b1: number, b2: number, b3: number): Vector {
        return new Vector(
            a2 * b3 - a3 * b2,
            a1 * b3 - a3 * b1,
            a1 * b2 - a2 * b1)
    }

    static dot_product(a: Vector, b: Vector): number {
        return this.dot_product_numbers(
            a.x, a.y, a.z,
            b.x, b.y, b.z)
    }

    static dot_product_numbers(
        ax: number, ay: number, az: number,
        bx: number, by: number, bz: number): number {
        return ax * bx + ay * by + az * bz
    }
    
    equals(vector: Vector): boolean {
        return this.x === vector.x
            && this.y === vector.y
            && this.z === vector.z
    }

    /** @deprecated use add_numbers instead */
    add(x: number, y: number, z: number): Vector {
        return new Vector(this.x + x, this.y + y, this.z + z)
    }

    /** @deprecated use subtract_numbers instead */
    subtract(x: number, y: number, z: number): Vector {
        return new Vector(this.x - x, this.y - y, this.z - z)
    }

    /** @deprecated use dot_product_numbers */
    static dotProductNumbers(
        ax: number, ay: number, az: number,
        bx: number, by: number, bz: number): number {
        return ax * bx + ay * by + az * bz
    }

    /** @deprecated use subtract_vector */
    static dotProduct(a: Vector, b: Vector): number {
        return this.dot_product_numbers(
            a.x, a.y, a.z,
            b.x, b.y, b.z)
    }

    /** @deprecated use add_vector */
    addVector(v: Vector): Vector {
        return this.add_numbers(v.x, v.y, v.z)
    }
    
    /** @deprecated use subtract_vector */
    subtractVector(v: Vector): Vector {
        return this.subtract_numbers(v.x, v.y, v.z)
    }

    /** @deprecated use cross_product_numbers */
    static crossProductNumbers(
        a1: number, a2: number, a3: number,
        b1: number, b2: number, b3: number): Vector {
        return new Vector(
            a2 * b3 - a3 * b2,
            a1 * b3 - a3 * b1,
            a1 * b2 - a2 * b1)
    }

    /** @deprecated use cross_product */
    static crossProduct(a: Vector, b: Vector): Vector {
        return Vector.cross_product_numbers(a.x, a.y, a.z, b.x, b.y, b.z)
    }

    /** @deprecated use from_array */
    static fromArray(array: number[], index = 0): Vector {
        return new Vector(array[index + 0], array[index + 1], array[index + 2])
    }

    /** @deprecated use vector_to_vector */
    vectorToVector(other:Vector) : Vector {
        return other.subtract_vector(this)
    }

    /** @deprecated use vectror_to */
    vectorTo(x: number, y: number, z:number) : Vector {
        return this.reverse_subtract(x,y,z)
    }

    /** @deprecated use distance_to */
    distanceTo(other: Vector): number {
        const dx = other.x - this.x
        const dy = other.y - this.y
        const dz = other.z - this.z
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

}
