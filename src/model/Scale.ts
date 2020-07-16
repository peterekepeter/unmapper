import { SheerAxis } from "./SheerAxis";
import { Vector } from "./Vector";
import { Matrix3x3 } from "./Matrix3x3";

export class Scale {

    static DEFAULT_SCALE_VECTOR = Vector.ONES;
    static DEFAULT_SCALE = new Scale(Vector.ONES, SheerAxis.None, 0);

    scale: Vector;
    sheerRate: number;
    sheerAxis: SheerAxis;

    constructor(
        scale = Scale.DEFAULT_SCALE_VECTOR,
        sheerAxis = SheerAxis.None,
        sheerRate = 0) {
        this.scale = scale;
        this.sheerAxis = sheerAxis;
        this.sheerRate = sheerRate;
        Object.freeze(this);
    }

    withScaleVector(scale: Vector)
    {
        if (scale.equals(this.scale)){
            return this;
        } else {
            return new Scale(scale, this.sheerAxis, this.sheerRate);
        }
    }

    toMatrix() : Matrix3x3 {
        // todo: implement sheer
        return Matrix3x3.scale(this.scale.x, this.scale.y, this.scale.z);
    }

    equals(other : Scale) : boolean {
        return this.sheerAxis === other.sheerAxis 
            && this.sheerRate === other.sheerRate
            && this.scale.equals(other.scale);
    }

    isDefault() : boolean {
        return this.equals(Scale.DEFAULT_SCALE);
    }

}