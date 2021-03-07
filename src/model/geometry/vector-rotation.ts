import { acos_degrees } from "../ExtendedMath"
import { Matrix3x3 } from "../Matrix3x3"
import { Vector } from "../Vector"
import { rodrigues_rotation_matrix } from "./rodrigues_rotation_matrix"


export function vector_to_vector_rotation_matrix(from: Vector, to: Vector): Matrix3x3 {
    const cross = from.cross(to)
    if (cross.equals(Vector.ZERO)) {
        return Matrix3x3.IDENTITY // no need to rotate
    }

    const from_unit = from.normalize()
    const to_unit = to.normalize()
    const rotation_axis = cross.normalize()
    const rotation_angle = angle_between_unit_vectors(from_unit, to_unit)
    const matrix = rodrigues_rotation_matrix(rotation_axis, rotation_angle)

    // apply correction because some handedness is incorrect
    if (matrix.apply(from_unit).distance_to(to_unit) > matrix.apply(to_unit).distance_to(from_unit)) {
        // detected inverse transform, return inverse matrix
        return rodrigues_rotation_matrix(rotation_axis, -rotation_angle)
    } else {
        return matrix
    }
}

export function angle_between_unit_vectors(unit_a: Vector, unit_b: Vector): number {
    const cos_a = Vector.dot_product(unit_a,unit_b)
    return acos_degrees(cos_a)
}
