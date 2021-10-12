import { BoundingBox } from "../model/BoundingBox"
import { Rotation } from "../model/Rotation"
import { Vector } from "../model/Vector"

export interface ViewTransform{
    can_3d_transform: boolean;
    view_center: Vector;
    device_size: number;
    device_pixel_ratio: number;
    scale: number;
    width: number;
    height: number; 
    view_rotation: Rotation;
    
    get_view_bounding_box(): BoundingBox;
    view_transform(vector: Vector): Vector;
    view_transform_x(vector: Vector): number;
    view_transform_y(vector: Vector): number;
    canvas_to_world_location(canvas_x: number, canvas_y: number): Vector;
}
