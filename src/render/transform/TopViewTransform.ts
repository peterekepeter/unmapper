import { BoundingBox } from "../../model/BoundingBox"
import { Matrix3x3 } from "../../model/Matrix3x3"
import { Rotation } from "../../model/Rotation"
import { Vector } from "../../model/Vector"
import { align_to_grid } from "../../model/algorithms/alignToGrid"
import { ViewTransform } from "../ViewTransform"
import { align_2d_view_to_pixels, find_nice_ratio, nice_round } from "./align_to_pixel"

export class TopViewTransform implements ViewTransform {

    width: number;
    height: number;
    device_size: number;
    device_pixel_ratio: number;
    view_center: Vector;
    view_rotation: Rotation;
    scale = 1;

    get_view_bounding_box(): BoundingBox {
        const x_size = this.width / 2 / this.device_size / this.scale
        const y_size = this.height / 2 / this.device_size / this.scale
        return new BoundingBox({
            min_x: this.view_center.x - x_size,
            max_x: this.view_center.x + x_size,
            min_y: this.view_center.y - y_size,
            max_y: this.view_center.y + y_size,
        })
    }

    view_transform(vector: Vector): Vector {
        throw new Error("Method not implemented.")
    }

    view_transform_x(vector: Vector): number {
        return (vector.x - this.view_center.x)
            * this.device_size * this.scale + this.width / 2
    }

    view_transform_y(vector: Vector): number {
        return (vector.y - this.view_center.y)
            * this.device_size * this.scale + this.height / 2
    }
    
    get can_3d_transform(): boolean { return false }

    canvas_to_world_location(canvas_x: number, canvas_y: number): Vector {
        return new Vector(

            this.view_center.x + (canvas_x - this.width / 2)
            / this.device_size / this.scale,

            this.view_center.y + (canvas_y - this.height / 2)
            / this.device_size / this.scale,

            this.view_center.z,
        )
    }

    align_to_pixels() {
        align_2d_view_to_pixels(this);
    }
}
