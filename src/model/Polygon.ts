import { Vector } from "./Vector";

export class Polygon
{
    public item : string; 
    public flags : number;
    public origin : Vector;
    public normal: Vector;
    public textureU : Vector;
    public textureV : Vector;
    public vertexes : Vector[];
}