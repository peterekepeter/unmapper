import { LogicError } from "./error/LogicError"
import { Vector } from "./Vector"

export class Plane {

    normal: Vector;
    distance: number;

    static XY = new Plane(Vector.UNIT_Z, 0);
    static XZ = new Plane(Vector.UNIT_Y, 0);
    static YZ = new Plane(Vector.UNIT_X, 0);

    static YX = new Plane(Vector.UNIT_NEGATIVE_Z, 0);
    static ZX = new Plane(Vector.UNIT_NEGATIVE_Y, 0);
    static ZY = new Plane(Vector.UNIT_NEGATIVE_X, 0);

    constructor(normal: Vector, distance_from_origin: number)
    constructor(normal: Vector, position: Vector)
    constructor(normal: Vector, b: number | Vector) {
        const length = normal.length()
        LogicError.if(length == 0, "plane must have a normal")
        if (length !== 1) {
            normal = normal.scale(1 / length)
        }
        this.normal = normal
        if (b instanceof Vector) {
            this.distance = Math.abs(this.normal.dot(b))
        } else {
            this.distance = b
        }
        LogicError.if(this.distance < 0, "distance from origin cannot be negative")
    }

    equals(other: Plane): boolean {
        return this === other || this.normal.equals(other.normal) && this.distance === other.distance
    }

    signed_distance_to_point(point: Vector): number {
        return this.normal.dot(point) + this.distance
    }

    is_in_front_of_point(point: Vector): boolean {
        return this.signed_distance_to_point(point) < 0
    }

    intersect_segment(a: Vector, b: Vector): Vector | null {
        const sdist_a = this.signed_distance_to_point(a)
        const sdist_b = this.signed_distance_to_point(b)
        if (sdist_a < 0 && sdist_b < 0 ||
            sdist_a > 0 && sdist_b > 0) {
            return null
        }
        if (sdist_a === 0) { return a }
        if (sdist_b === 0) { return b }
        const dist_a = Math.abs(sdist_a)
        const dist_b = Math.abs(sdist_b)
        const total = dist_a + dist_b
        return new Vector(
            (a.x * dist_b + b.x * dist_a) / total,
            (a.y * dist_b + b.y * dist_a) / total,
            (a.z * dist_b + b.z * dist_a) / total,
        )
    }

    ray_intersection(ray_origin: Vector, ray_direction: Vector) : number | null {
        const direction_dot_normal = ray_direction.dot(this.normal)
        if (direction_dot_normal == 0){
            return null
        }
        return this.distance - this.normal.dot(ray_origin) / direction_dot_normal
    }

}