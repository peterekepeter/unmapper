import { Vector } from "./Vector";


export class BrushVertex
{
    position : Vector
    selected : boolean = false;

    constructor(position : Vector){
        this.position = position;
    }

    shallowCopy() : BrushVertex {
        const vertex = new BrushVertex(this.position);
        Object.assign(vertex, this);
        return vertex;
    }
}