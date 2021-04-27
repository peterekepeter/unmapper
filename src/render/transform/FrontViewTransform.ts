import { BoundingBox } from "../../model/BoundingBox"
import { Matrix3x3 } from "../../model/Matrix3x3";
import { Vector } from "../../model/Vector"
import { ViewTransform } from "../ViewTransform"


export class FrontViewTransform implements ViewTransform {

    width: number;
    height: number;
    deviceSize: number;
    view_center: Vector;
    view_rotation: Matrix3x3;

    constructor(public scale = 1){
    }

    get_view_bounding_box(): BoundingBox {
        const y_size = this.width / 2 / this.deviceSize / this.scale
        const z_size = this.height / 2 / this.deviceSize / this.scale
        return new BoundingBox({
            min_y: this.view_center.y - y_size, max_y: this.view_center.y + y_size,
            min_z: this.view_center.z - z_size, max_z: this.view_center.z + z_size
        })
    }

    get can_3d_transform(): boolean { return false }

    view_transform(vector: Vector): Vector {
        throw new Error("Method not implemented.")
    }

    view_transform_x(vector: Vector): number {
        return (vector.y - this.view_center.y)
            * this.deviceSize * this.scale + this.width / 2
    }

    view_transform_y(vector: Vector): number {
        return (vector.z - this.view_center.z) * -1
            * this.deviceSize * this.scale + this.height / 2
    }

    canvas_to_world_location(canvas_x: number, canvas_y: number): Vector {
        return new Vector(

            this.view_center.x,

            this.view_center.y + (canvas_x - this.width / 2)
            / this.deviceSize / this.scale,

            this.view_center.z - (canvas_y - this.height / 2)
            / this.deviceSize / this.scale
        )
    }
}