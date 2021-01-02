import { BrushModel } from "../BrushModel";
import { Vector } from "../Vector";

export function uv_triplanar_map(input_brush : BrushModel) : BrushModel {
    const new_brush = input_brush.shallowCopy();
    new_brush.polygons = new_brush.polygons.map(input_poly => {
        const new_poly = input_poly.shallowCopy();
        new_poly.origin = Vector.ZERO;
        new_poly.panU = 0;
        new_poly.panV = 0;
        const abs_x = Math.abs(input_poly.normal.x);
        const abs_y = Math.abs(input_poly.normal.y);
        const abs_z = Math.abs(input_poly.normal.z);
        let best_axis: 0 | 1 | 2 = 0;
        let best_length = abs_x;
        if (abs_y > best_length){
            best_axis = 1;
            best_length = abs_y;
        }
        if (abs_z > best_length){
            best_axis = 2;
            best_length = abs_z;
        }
        switch (best_axis){
            case 0:
                // TODO: not calcualted correcly
                new_poly.textureU = Vector.UNIT_Y;
                new_poly.textureV = Vector.UNIT_Z;
                break;
            case 1:
                new_poly.textureU = Vector.UNIT_X;
                new_poly.textureV = Vector.UNIT_Z;
                break;
            case 2:
                new_poly.textureU = Vector.UNIT_X;
                new_poly.textureV = Vector.UNIT_Y;
                break;
        }
        return new_poly;
    })
    return new_brush;
}