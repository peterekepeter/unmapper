import { Vector } from "./Vector";

export class Actor
{
    public name : string;
    public className : string;
    public location : Vector;
    public oldLocation : Vector;
    public group : string[];
    
    // additional unsupported props
    public props : { ["string"] : string };
}