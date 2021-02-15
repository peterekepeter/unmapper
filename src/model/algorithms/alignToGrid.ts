import { BrushModel } from "../BrushModel";
import { BrushVertex } from "../BrushVertex";
import { Vector } from "../Vector";


export function align_to_grid(vector : Vector, grid : Vector) : Vector
{
    let {x,y,z} = vector;
    
    if (grid.x !== 0){ x = Math.round(x/grid.x)*grid.x; }
    if (grid.y !== 0){ y = Math.round(y/grid.y)*grid.y; }
    if (grid.z !== 0){ z = Math.round(z/grid.z)*grid.z; }

    if (vector.x === x && vector.y === y && vector.z === z){
        return vector;
    }
    else {
        return new Vector(x,y,z);
    }
}

export function align_brush_model_to_grid(brush : BrushModel, grid : Vector) : BrushModel
{
    const result : BrushVertex[] = [];
    let changeDetected = false;
    for(const vertex of brush.vertexes)
    {
        const newPos = align_to_grid(vertex.position, grid);
        if (newPos !== vertex.position){
            const alignedVertex = vertex.shallowCopy();
            alignedVertex.position = newPos;
            result.push(alignedVertex);
            changeDetected = true;
        } else {
            result.push(vertex);
        }
    }
    if (changeDetected){
        const updatedBrush = brush.shallowCopy();
        updatedBrush.vertexes = result;
        return updatedBrush;
    } else {
        return brush;
    }
}