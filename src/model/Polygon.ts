import { Vector } from "./Vector";

export class Polygon
{
    item : string = ''; 
    flags : number = 0;
    origin : Vector = Vector.ZERO;
    normal: Vector = Vector.UNIT_Z;
    textureU : Vector = Vector.UNIT_X;
    textureV : Vector = Vector.UNIT_Y;
    vertexes : Vector[] = [];
    texture: string;
}