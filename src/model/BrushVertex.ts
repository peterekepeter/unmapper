import { Vector } from "./Vector";


export class BrushVertex {
    position: Vector
    selected = false;

    constructor(position: Vector, selected = false) {
        this.position = position
        this.selected = selected
    }

    shallowCopy(): BrushVertex {
        const vertex = new BrushVertex(this.position);
        Object.assign(vertex, this);
        return vertex;
    }

    static fromVector(v: Vector): BrushVertex {
        return new BrushVertex(v);
    }

    static fromCoords(x = 0, y = 0, z = 0) {
        return this.fromVector(new Vector(x, y, z));
    }

    static fromArray(data:number[], index = 0){
        return this.fromVector(Vector.fromArray(data, index));
    }

    static fromArrayToList(data:number[], index=0, vertexCount=-1){
        if (vertexCount == -1){
            vertexCount = Math.floor(data.length/3);
        }
        let result: BrushVertex[] = [];
        for (let i=0; i<vertexCount; i++){
            result.push(BrushVertex.fromArray(data, index));
            index+=3;
        }
        return result;
    }
}