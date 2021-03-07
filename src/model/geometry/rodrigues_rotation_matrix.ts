import { cos_degrees, sin_degrees } from "../ExtendedMath"
import { Matrix3x3 } from "../Matrix3x3"
import { Vector } from "../Vector"


export function rodrigues_rotation_matrix(axis_unit_vector: Vector, angle_degrees: number): Matrix3x3 {
    // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
    // R = I + (sin A) K + (1 - cos A) K^2
    const k = axis_unit_vector
    const K = new Matrix3x3(
        0, -k.z, k.y,
        k.z, 0, -k.x,
        -k.y, k.x, 0
    );
    const K2 = K.multiply(K)
    const cos_a = cos_degrees(angle_degrees)
    const sin_a = sin_degrees(angle_degrees)
    const one_minus_cos_a = 1 - cos_a
    return Matrix3x3.IDENTITY
        .add(K.scale(sin_a))
        .add(K2.scale(one_minus_cos_a))
}
