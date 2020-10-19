import { Vector } from "./Vector";

export class BrushPolygonData
{
    item : string = ''; 
    flags : number = 0;
    origin : Vector = Vector.ZERO;
    normal: Vector = Vector.UNIT_Z;
    textureU : Vector = Vector.UNIT_X;
    textureV : Vector = Vector.UNIT_Y;
    vertexes : Vector[] = [];
    texture: string = null;
    link: number = 0;
    panU: number = 0;
    panV: number = 0;
}