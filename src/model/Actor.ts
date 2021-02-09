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
    public static SUPPORTED_PROPERTIES = [
        "Location"
    ]
    
    // additional unsupported props go here, these still need to be reencoded
    public unsupportedProperties : { [key:string] : any } = {};

    get_property(name: string): any {
        switch(name){
            case "Location": return this.location;
            default: return this.unsupportedProperties[name];
        }
    }

    set_property_immutable(name: string, value: any) : Actor {
        const new_actor = this.shallowCopy();
        new_actor.set_property_mutable(name, value);
        return new_actor;
    }

    set_property_mutable(name: string, value: any) : void {
        switch(name){
            case "Location": 
                this.location = accept_vector(value);
                break;
        }
    }

    is_supported_property(name: string)
    {
        return Actor.SUPPORTED_PROPERTIES.indexOf(name) !== -1
    }

    shallowCopy(){
        const copy = new Actor();
        Object.assign(copy, this);
        return copy;
    }
}

function accept_vector(value: any) : Vector {
    if (typeof value === 'object'){
        if(value.constructor === Vector){
            return value;
        }
    }
    throw new Error('not a vector');
}