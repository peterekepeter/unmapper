import { Matrix3x3 } from "../../Matrix3x3"
import { Rotation } from "../../Rotation"
import { Scale } from "../../Scale"
import { Vector } from "../../Vector"
import {
    decompose_matrix_rotation as decompose_rotation,
    decompose_matrix_scaling as decompose_scaling
} from "../decompose-matrix"


test('decompose uniform scaling', () =>
    expect(decompose_scaling(Matrix3x3.uniformScale(4)))
        .toEqual([new Scale(new Vector(4, 4, 4)), Matrix3x3.IDENTITY]))

test('decompose non-uniform scaling', () =>
    expect(decompose_scaling(Matrix3x3.scale(1, 2, 3)))
        .toEqual([new Scale(new Vector(1, 2, 3)), Matrix3x3.IDENTITY]))

test('decompose non-uniform scaling', () =>
    expect(decompose_scaling(Matrix3x3.scale(1, 2, 3).multiply(Matrix3x3.rotateDegreesZ(45))))
        .toEqual([new Scale(new Vector(1, 2, 3)), Matrix3x3.rotateDegreesZ(45)]))

const test_angles = [45,60,-15,90,180]

test_angles.forEach(angle => {
    test(`decompose roll ${angle}`, () =>
        expect(decompose_rotation(new Rotation(0,0,angle).to_matrix()))
            .toEqual([new Rotation(0, 0, angle), Matrix3x3.IDENTITY]))
    test(`decompose yaw ${angle}`, () =>
        expect(decompose_rotation(new Rotation(0,angle,0).to_matrix()))
            .toEqual([new Rotation(0, angle, 0), Matrix3x3.IDENTITY]))
})

