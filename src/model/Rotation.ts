import { Vector } from "./Vector";
import { fmod, DEGREES_FULL_TURN, DEGREES_QUARTER_TURN } from "./ExtendedMath";
import { Matrix3x3 } from "./Matrix3x3";

export class Rotation {
    roll: number;
    pitch: number;
    yaw: number;

    static FULL_TURN = DEGREES_FULL_TURN;
    static HALF_TURN = DEGREES_FULL_TURN;
    static QUARTER_TURN = DEGREES_QUARTER_TURN;

    static IDENTITY = new Rotation(0, 0, 0);

    constructor(pitch = 0, yaw = 0, roll = 0) {
        this.roll = this._wrap_comp(roll);
        this.pitch = this._wrap_comp(pitch);
        this.yaw = this._wrap_comp(yaw);
        Object.freeze(this);
    }

    public equals(rotation: Rotation) {
        return this.roll === rotation.roll
            && this.pitch === rotation.pitch
            && this.yaw === rotation.yaw;
    }

    public add(pitch = 0, yaw = 0, roll = 0) {
        return new Rotation(this.pitch + pitch, this.yaw + yaw, this.roll + roll);
    }

    public toMatrix() : Matrix3x3 {
        return Matrix3x3.IDENTITY
            .rotateDegreesX(this.roll)
            .rotateDegreesY(this.pitch)
            .rotateDegreesZ(this.yaw);
    }

    public apply(vector: Vector): Vector {
        return this.toMatrix().apply(vector);
    }

    private _wrap_comp(value : number) : number {
        return fmod(value, Rotation.FULL_TURN);
    }
}