import { BoundingBox } from "../../model/BoundingBox"
import { Matrix3x3 } from "../../model/Matrix3x3";
import { Rotation } from "../../model/Rotation";
import { Vector } from "../../model/Vector"
import { ViewTransform } from "../ViewTransform"


export class SideViewTransform implements ViewTransform {

    width: number;
    height: number;
    device_size: number;
    view_center: Vector;
    view_rotation: Rotation; 
    scale = 1;

    get_view_bounding_box(): BoundingBox {
        const x_size = this.width / 2 / this.device_size / this.scale
        const z_size = this.height / 2 / this.device_size / this.scale
        return new BoundingBox({
            min_x: this.view_center.x - x_size, max_x: this.view_center.x + x_size,
            min_z: this.view_center.z - z_size, max_z: this.view_center.z + z_size
        })
    }

    view_transform(vector: Vector): Vector {
        throw new Error("Method not implemented.")
    }

    view_transform_x(vector: Vector): number {
        return (vector.x - this.view_center.x) * this.device_size * this.scale + this.width / 2;
    }

    view_transform_y(vector: Vector): number {
        return (vector.z - this.view_center.z) * -1 * this.device_size * this.scale + this.height / 2;
    }
    
    get can_3d_transform(): boolean { return false }

    canvas_to_world_location(canvas_x: number, canvas_y: number): Vector {
        return new Vector(
            this.view_center.x + (canvas_x - this.width/2) / this.device_size / this.scale,
            this.view_center.y,
            this.view_center.z - (canvas_y - this.height/2) / this.device_size / this.scale)
    }
}
