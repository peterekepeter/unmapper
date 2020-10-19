import { BrushModel } from "../BrushModel";
import { BrushVertex } from "../BrushVertex";
import { Vector } from "../Vector";


export function alignToGrid(vector : Vector, grid : Vector)
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

export function alignBrushModelToGrid(brush : BrushModel, grid : Vector)
{
    const result : BrushVertex[] = [];
    let changeDetected = false;
    for(const vertex of brush.vertexes)
    {
        const newPos = alignToGrid(vertex.position, grid);
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