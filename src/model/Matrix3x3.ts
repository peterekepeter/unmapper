import { Vector } from "./Vector";
import { sinDegrees, cosDegrees } from "./ExtendedMath";

export class Matrix3x3 {

    m00: number; m01: number; m02: number;
    m10: number; m11: number; m12: number;
    m20: number; m21: number; m22: number;

    static IDENTITY = new Matrix3x3(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1);

    static ZERO = new Matrix3x3(
        0, 0, 0,
        0, 0, 0,
        0, 0, 0);

    constructor(
        m00: number, m01: number, m02: number,
        m10: number, m11: number, m12: number,
        m20: number, m21: number, m22: number) {
        this.m00 = m00; this.m01 = m01; this.m02 = m02;
        this.m10 = m10; this.m11 = m11; this.m12 = m12;
        this.m20 = m20; this.m21 = m21; this.m22 = m22;
    }

    apply(vector: Vector): Vector {
        return new Vector(
            this.getTransformedX(vector.x, vector.y, vector.z),
            this.getTransformedY(vector.x, vector.y, vector.z),
            this.getTransformedZ(vector.x, vector.y, vector.z)
        );
    }

    multiply(matrix: Matrix3x3) {
        return Matrix3x3.multiply(this, matrix);
    }

    equals(matrix: Matrix3x3): boolean {
        return Matrix3x3.equals(this, matrix);
    }

    uniformScale(s: number) {
        return s === 1 ? this :
            this.multiply(Matrix3x3.uniformScale(s));
    }

    scale(sx: number, sy: number, sz: number) {
        return sx === 1 && sy === 1 && sz === 1 ? this :
            this.multiply(Matrix3x3.scale(sx, sy, sz));
    }

    rotateDegreesX(degrees: number) {
        return degrees === 0 ? this
            : this.multiply(Matrix3x3.rotateDegreesX(degrees));
    }

    rotateDegreesY(degrees: number) {
        return degrees === 0 ? this
            : this.multiply(Matrix3x3.rotateDegreesY(degrees));
    }

    rotateDegreesZ(degrees: number) {
        return degrees === 0 ? this
            : this.multiply(Matrix3x3.rotateDegreesZ(degrees));
    }

    static uniformScale(s: number) {
        return new Matrix3x3(
            s, 0, 0,
            0, s, 0,
            0, 0, s);
    }

    static scale(sx: number, sy: number, sz: number) {
        return new Matrix3x3(
            sx, 0, 0,
            0, sy, 0,
            0, 0, sz);
    }

    static rotateDegreesX(degrees: number) {
        const s = sinDegrees(degrees);
        const c = cosDegrees(degrees);
        const z = -s;
        return new Matrix3x3(
            1, 0, 0,
            0, c, z,
            0, s, c);
    }

    static rotateDegreesY(degrees: number) {
        const s = sinDegrees(degrees);
        const c = cosDegrees(degrees);
        const z = -s;
        return new Matrix3x3(
            c, 0, z,
            0, 1, 0,
            s, 0, c);
    }

    static rotateDegreesZ(degrees: number) {
        const s = sinDegrees(degrees);
        const c = cosDegrees(degrees);
        const z = -s;
        return new Matrix3x3(
            c, z, 0,
            s, c, 0,
            0, 0, 1);
    }

    getTransformedX(x: number, y: number, z: number): number {
        return this.m00 * x + this.m01 * y + this.m02 * z;
    }

    getTransformedY(x: number, y: number, z: number): number {
        return this.m10 * x + this.m11 * y + this.m12 * z;
    }

    getTransformedZ(x: number, y: number, z: number): number {
        return this.m20 * x + this.m21 * y + this.m22 * z;
    }

    is_scaling_matrix():boolean {
        return this.m01 === 0 
            && this.m02 === 0 
            && this.m10 === 0 
            && this.m12 === 0 
            && this.m20 === 0
            && this.m21 === 0
    }

    is_uniform_scaling_matrix():boolean {
        return this.is_scaling_matrix() 
            && this.m00 === this.m11 
            && this.m11 === this.m22 
    }

    is_identity(): boolean {
        return this.equals(Matrix3x3.IDENTITY)
    }

    static multiply(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
        return new Matrix3x3(
            // row1
            a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20,
            a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21,
            a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22,
            // row2
            a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20,
            a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21,
            a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22,
            // row3
            a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20,
            a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21,
            a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22,
        )
    }

    static equals(a: Matrix3x3, b: Matrix3x3): boolean {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02
            && a.m10 === b.m10 && a.m11 === b.m11 && a.m12 === b.m12
            && a.m20 === b.m20 && a.m21 === b.m21 && a.m22 === b.m22;
    }

}