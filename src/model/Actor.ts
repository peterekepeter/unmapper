import { Vector } from "./Vector";
import { BrushModel } from "./BrushModel";
import { CsgOperation } from "./CsgOperation";
import { PolyFlags } from "./PolyFlags";

export class Actor
{
    public name : string = "Actor0";
    public className : string = "Actor";
    public location : Vector = Vector.ZERO;
    public oldLocation : Vector = Vector.ZERO;
    public group : string[] = [];
    public brushModel: BrushModel | null = null;
    public csgOperation: CsgOperation | null = null;
    public selected : boolean = false;
    public polyFlags : PolyFlags = PolyFlags.None;
    
    // additional unsupported props go here, these still need to be reencoded
    public unsupportedProperties : { [key:string] : string | object } = {};
}