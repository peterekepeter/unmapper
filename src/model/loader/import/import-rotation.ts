import { Rotation } from "../../Rotation";
import { Parser } from "./Parser";
import { importSubobject } from "./import-subobject";
import { unrealAngleToDegrees } from "../converter/convert-angles";

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
    const unrealAngle = Number(obj[key]);
    if (isNaN(unrealAngle)){
        return 0;
    } 
    return unrealAngleToDegrees(unrealAngle);
}