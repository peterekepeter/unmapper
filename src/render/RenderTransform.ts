import { BoundingBox } from "../model/BoundingBox";
import { Matrix3x3 } from "../model/Matrix3x3";
import { Vector } from "../model/Vector";


export interface RenderTransform{
    can_3d_transform: boolean;
    view_center: Vector;
    deviceSize: number;
    width: number;
    height: number; 
    view_rotation: Matrix3x3;
    
    get_view_bounding_box(): BoundingBox;
    view_transform(vector: Vector): Vector;
    view_transform_x(vector: Vector): number;
    view_transform_y(vector: Vector): number;
    canvas_to_world_location(canvas_x: number, canvas_y: number): Vector;
}