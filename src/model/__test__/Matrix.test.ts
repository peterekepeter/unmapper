import { Matrix3x3 } from "../Matrix3x3";
import { Vector } from "../Vector";


describe('Matrix', () => {
    test('identity does not change vector', () =>
        expect(Matrix3x3.IDENTITY.apply(new Vector(1, 2, 3)))
            .toEqual(new Vector(1, 2, 3)));

    test('zero zeroes vector', () =>
        expect(Matrix3x3.ZERO.apply(new Vector(1, 2, 3)))
            .toEqual(new Vector(0, 0, 0)));

    test('can uniformly scale vector', () =>
        expect(Matrix3x3.uniformScale(2).apply(new Vector(1, 2, 3)))
            .toEqual(new Vector(2, 4, 6)))

    test('can arbitrarly scale vector', () =>
        expect(Matrix3x3.scale(-4,2,3).apply(new Vector(1, 2, 3)))
            .toEqual(new Vector(-4, 4, 9)))

    test('can rotate X', () =>
        expect(Matrix3x3.rotateDegreesX(180).apply(new Vector(0, 1, 0)))
            .toEqual(new Vector(0, -1, 0)))

    test('Matrix3x3.IDENTITY is_identity', () => {
        expect(Matrix3x3.IDENTITY.is_identity()).toBe(true)
    })

    test('rotation matrix is not is_identity', () => {
        expect(Matrix3x3.rotateDegreesX(90).is_identity()).toBe(false)
    })

    test('rotation matrix not is_scaling_matrix', () => {
        expect(Matrix3x3.rotateDegreesX(90).is_scaling_matrix()).toBe(false)
    })

    test('is_scaling_matrix', () => {
        expect(new Matrix3x3(
            1,0,0,
            0,2,0,
            0,0,3
        ).is_scaling_matrix()).toBe(true)
    })

    test('is_uniform_scaling_matrix', () => {
        expect(new Matrix3x3(
            3,0,0,
            0,3,0,
            0,0,3
        ).is_uniform_scaling_matrix()).toBe(true)
    })
    
});