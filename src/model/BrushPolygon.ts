import { BrushEdge } from "./BrushEdge";
import { BrushVertex } from "./BrushVertex";
import { Vector } from "./Vector";

export class BrushPolygon
{
    median: Vector = null;
    vertexes: number[] = [];
    edges: number[] = [];
    item : string = ''; 
    flags : number = 0;
    origin : Vector = Vector.ZERO;
    normal: Vector = Vector.UNIT_Z;
    textureU : Vector = Vector.UNIT_X;
    textureV : Vector = Vector.UNIT_Y;
    texture: string = null;
    link: number = 0;
    panU: number = 0;
    panV: number = 0;

    addVertexIndex(vertexIndex: number){
        this.vertexes.push(vertexIndex);
    }

    shallowCopy(){
        const copy = new BrushPolygon();
        Object.assign(copy, this);
        return copy;
    }
}