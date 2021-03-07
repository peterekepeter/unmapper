import { atan_degrees } from "../ExtendedMath";
import { Matrix3x3 } from "../Matrix3x3";
import { Rotation } from "../Rotation";
import { Scale } from "../Scale";
import { Vector } from "../Vector";


export function decompose_matrix_scaling(transformation_matrix: Matrix3x3): [Scale, Matrix3x3] {
    const T = transformation_matrix
    if (T.is_scaling_matrix()) {
        // simple case
        return [new Scale(new Vector(T.m00, T.m11, T.m22)), Matrix3x3.IDENTITY]
    }
    const row0 = new Vector(T.m00, T.m01, T.m02)
    const row1 = new Vector(T.m10, T.m11, T.m12)
    const row2 = new Vector(T.m20, T.m21, T.m22)
    const sx = row0.length()
    const sy = row1.length()
    const sz = row2.length()
    return [
        new Scale(new Vector(sx, sy, sz)),
        new Matrix3x3(
            T.m00/sx, T.m01/sx, T.m02/sx,
            T.m10/sy, T.m11/sy, T.m12/sy,
            T.m20/sz, T.m21/sz, T.m22/sz,
        )
    ]
}

export function decompose_matrix_rotation(transformation_matrix: Matrix3x3): [Rotation, Matrix3x3] {
    const T = transformation_matrix
    if (T.m00 === 1 && T.m01 === 0 && T.m02 === 0 && T.m10 === 0 && T.m20 === 0){
        // simple case: roll, rotate around X
        return [
            new Rotation(0, 0, -atan_degrees(T.m21, T.m22)),
            Matrix3x3.IDENTITY
        ]
    }
    if (T.m22 === 1 && T.m21 === 0 && T.m20 === 0 && T.m12 === 0 && T.m02 === 0){
        // simple case: yaw, rotate around Z
        return [
            new Rotation(0, atan_degrees(T.m10, T.m11), 0),
            Matrix3x3.IDENTITY
        ]
    }
    if (T.m11 === 1 && T.m01 === 0 && T.m21 === 0 && T.m10 === 0 && T.m12 === 0){
        // simple case: pitch, rotate around Y
        return [
            new Rotation(atan_degrees(T.m20, T.m22), 0, 0),
            Matrix3x3.IDENTITY
        ]
    }
    // TODO: solve general cases
    return [Rotation.IDENTITY, T] // failed to decompose, return original
}