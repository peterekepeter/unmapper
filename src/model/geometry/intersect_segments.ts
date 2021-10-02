import { Plane } from "../Plane"
import { Vector } from "../Vector"

export function intersect_segments(a: Vector, b: Vector, c: Vector, d: Vector): Vector | null{
    const plane = Plane.from_points(a, b, c)
    if (Math.abs(plane.signed_distance_to_point(d)) > 1e-10){
        return null // lines not on the same plane
    }
    const candidate_0 = Plane.from_points(a, b, a.add_vector(plane.normal)).intersect_segment(c, d)
    const candidate_1 = Plane.from_points(c, d, c.add_vector(plane.normal)).intersect_segment(a, b)
    if (candidate_0 == null || candidate_1 == null){
        return null // lines might intersect but segments don't
    }
    // return average of 2 candidates
    return candidate_0.add_vector(candidate_1).scale(0.5) 
}

