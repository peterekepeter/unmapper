import { Vector } from "../Vector"

/**
 * Returns closest point to line but only if point is inside segment
 */
export function precise_closest_point_to_line_inside_segment(line_point_a: Vector, line_point_b: Vector, query_location: Vector): Vector | null {
    const closest = precise_closest_point_to_line(line_point_a, line_point_b, query_location)
    const dist_q_a = distance_squared(query_location, line_point_a)
    const dist_q_b = distance_squared(query_location, line_point_b)
    const dist_q_c = distance_squared(query_location, closest)
    if (dist_q_c < dist_q_a && dist_q_c < dist_q_b) {
        return closest
    }
}

/**
 * Returns closest point to line but only if point is inside segment
 */
export function fast_closest_point_to_line_inside_segment(line_point_a: Vector, line_point_b: Vector, query_location: Vector): Vector | null {
    const closest = fast_closest_point_to_line(line_point_a, line_point_b, query_location)
    const dist_q_a = distance_squared(query_location, line_point_a)
    const dist_q_b = distance_squared(query_location, line_point_b)
    const dist_q_c = distance_squared(query_location, closest)
    if (dist_q_c < dist_q_a && dist_q_c < dist_q_b) {
        return closest
    }
}

/**
 * Returns closest point to line defined by two points.
 */
export function precise_closest_point_to_line(line_point_a: Vector, line_point_b: Vector, query_location: Vector): Vector{
    // create a vector which intersects the line, then extract the projected component
    // and then eliminate it to get the point's projection onto the line
    
    // there is significant precision loss with the scaled addition,
    // so we do this twice for both points then take the average
    let result_a: Vector, result_b:Vector

    const line_direction = line_point_b.subtract_vector(line_point_a).normalize()
    const r_line_direction = line_direction.scale(-1) // normalized vector can be reused

    for (let i=0; i<2; i++){

        const diff_to_a = query_location.subtract_vector(line_point_a)
        const projection = line_direction.scale(diff_to_a.dot(line_direction))
        result_a = line_point_a.add_vector(projection)
    
        // calculate the same from the other direction
        const diff_to_b = query_location.subtract_vector(line_point_b)
        result_b = line_point_b.add_vector(r_line_direction.scale(diff_to_b.dot(r_line_direction)))

        line_point_a = result_a
        line_point_b = result_b
    }

    // take mean of the two for better precision
    return result_a.add_vector(result_b).scale(0.5)
}

/**
 * Returns closest point to line defined by two points.
 */
export function fast_closest_point_to_line(line_point_a: Vector, line_point_b: Vector, query_location: Vector): Vector{
    const line_direction = line_point_b.subtract_vector(line_point_a).normalize()
    const diff_to_a = query_location.subtract_vector(line_point_a)
    const projection = line_direction.scale(diff_to_a.dot(line_direction))
    return line_point_a.add_vector(projection)
}

function distance_squared(a: Vector, b: Vector): number {
    const x = a.x - b.x
    const y = a.y - b.y
    const z = a.z - b.z
    return x*x + y*y + z*z
}
