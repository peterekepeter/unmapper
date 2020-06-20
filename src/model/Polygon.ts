import { Vector } from "./Vector";

export class Polygon
{
    public item : string = ''; 
    public flags : number = 0;
    public origin : Vector = Vector.ZERO;
    public normal: Vector = Vector.UNIT_Z;
    public textureU : Vector = Vector.UNIT_X;
    public textureV : Vector = Vector.UNIT_Y;
    public vertexes : Vector[] = [];
}