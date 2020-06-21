import { Rotation } from "../../Rotation";
import { Parser } from "./Parser";
import { importSubobject } from "./import-subobject";
import { UNREAL_FULL_TURN, DEGREES_FULL_TURN } from "../../ExtendedMath";

export function importRotation(arg : string | Parser) : Rotation {
    const obj = importSubobject(arg);
    return new Rotation(
        parseRotationComponent(obj, 'Pitch'),
        parseRotationComponent(obj, 'Yaw'),
        parseRotationComponent(obj, 'Roll'),
    )
}

function parseRotationComponent(obj: any, key:string){
    if (obj[key] == null){
        return 0;
    }
    const value = Number(obj[key]);
    if (isNaN(value)){
        return 0;
    } 
    return value / UNREAL_FULL_TURN * DEGREES_FULL_TURN;
}