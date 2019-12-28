import { Vector } from "./Vector";

export class Polygon
{
    public item : string = ''; 
    public flags : number = 0;
    public origin : Vector = Vector.zero;
    public normal: Vector = Vector.zUnit;
    public textureU : Vector = Vector.xUnit;
    public textureV : Vector = Vector.yUnit;
    public vertexes : Vector[] = [];
}