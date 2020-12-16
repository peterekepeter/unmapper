import { BrushPolygon } from "../BrushPolygon";
import { BrushVertex } from "../BrushVertex";
import { Vector } from "../Vector";

export function calculate_polygon_normal(brush_vertexex: BrushVertex[], poly: BrushPolygon) : Vector
{
    if (poly.vertexes.length < 3){
        throw new Error("cannot calcualte median for invalid polygon");
    }
    // assumes median is correct
    let previous_index = poly.vertexes[poly.vertexes.length-1];
    let cross_sum = Vector.ZERO;
    for (const current_index of poly.vertexes){
        cross_sum = cross_sum.addVector(Vector.crossProduct(
            poly.median.vectorToVector(brush_vertexex[previous_index].position), 
            poly.median.vectorToVector(brush_vertexex[current_index].position)));
        previous_index = current_index;
    }
    const normalized = cross_sum.normalize();
    
    // y axis is flipped!
    return new Vector(normalized.x, normalized.y !== 0 ? -normalized.y : 0, normalized.z);
}