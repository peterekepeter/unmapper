import { cos_degrees, sin_degrees } from "../ExtendedMath"
import { Matrix3x3 } from "../Matrix3x3"
import { Vector } from "../Vector"

export function vector_to_vector_rotation_matrix(from: Vector, to: Vector): Matrix3x3 {
    const cross = from.cross(to)
    if (cross.equals(Vector.ZERO)){
        return Matrix3x3.IDENTITY // no need to rotate
    }
    
    const from_unit = from.normalize()
    const to_unit = to.normalize()
    const rotation_axis = cross.normalize()
    const rotation_angle = Vector.angle_between_normalized(from_unit, to_unit)
    const matrix = rodrigues_rotation_matrix(rotation_axis, rotation_angle)

    // apply correction because some handedness is incorrect
    if (matrix.apply(from_unit).distance_to(to_unit) > matrix.apply(to_unit).distance_to(from_unit)){
        // detected inverse transform, return inverse matrix
        return rodrigues_rotation_matrix(rotation_axis, -rotation_angle)
    } else {
        return matrix
    }
}
 
export function rodrigues_rotation_matrix(axis_unit_vector: Vector, angle_degrees: number): Matrix3x3 {
    // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
    // R = I + (sin A) K + (1 - cos A) K^2
    const k = axis_unit_vector
    const K = new Matrix3x3( // K
        0, -k.z, k.y,
        k.z, 0, -k.x,
        -k.y, k.x, 0
    )
    const K2 = K.multiply(K)
    const cos_a = cos_degrees(angle_degrees)
    const sin_a = sin_degrees(angle_degrees)
    const one_minus_cos_a = 1 - cos_a
    return Matrix3x3.IDENTITY
        .add(K.scale(sin_a))
        .add(K2.scale(one_minus_cos_a))
}
