import { Vector } from "./Vector";
import { BrushModel } from "./BrushModel";
import { CsgOperation } from "./CsgOperation";
import { PolyFlags } from "./PolyFlags";
import { Scale } from "./Scale";
import { Rotation } from "./Rotation";

export class Actor
{
    public name : string = Actor.DEFAULT_ACTOR_NAME;
    public className : string = "Actor";
    public rotation : Rotation = Rotation.IDENTITY;
    public location : Vector = Vector.ZERO;
    public oldLocation : Vector | null = null;
    public prePivot: Vector | null = null;
    public group : string[] = [];
    public brushModel: BrushModel | null = null;
    public csgOperation: CsgOperation | null = null;
    public selected : boolean = false;
    public polyFlags : PolyFlags = PolyFlags.None;
    public mainScale = Scale.DEFAULT_SCALE;
    public postScale = Scale.DEFAULT_SCALE;
    public tempScale = Scale.DEFAULT_SCALE;

    public static DEFAULT_ACTOR_NAME = "Actor0";
    
    // additional unsupported props go here, these still need to be reencoded
    public unsupportedProperties : { [key:string] : any } = {};
}