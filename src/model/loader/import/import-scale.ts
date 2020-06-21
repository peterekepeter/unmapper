import { makeParser } from "./parser-helper";
import { Parser } from "./Parser";
import { Scale } from "../../Scale";
import { importSubobject } from "./import-subobject";
import { SheerAxis } from "../../SheerAxis";
import { sheerAxisFromString } from "../converter/convert-SheerAxis";
import { Vector } from "../../Vector";


const DEFAULT_SCALE = 1;
const DEFAULT_AXIS = SheerAxis.None;
const DEFAULT_RATE = 0;

export function importScale(arg : string | Parser) : Scale {
    const obj = importSubobject(arg);
    let x = DEFAULT_SCALE, y = DEFAULT_SCALE, z = DEFAULT_SCALE;
    let axis = DEFAULT_AXIS, rate = DEFAULT_RATE;
    if (obj.Scale != null)
    {
        const scale = obj.Scale;
        x = parseNumberProp(scale, 'X', DEFAULT_SCALE);
        y = parseNumberProp(scale, 'Y', DEFAULT_SCALE);
        z = parseNumberProp(scale, 'Z', DEFAULT_SCALE);
    }
    if (obj.SheerAxis != null){
        axis = parseAxis(obj.SheerAxis, DEFAULT_AXIS);
    }
    rate = parseNumberProp(obj, 'SheerRate', DEFAULT_RATE);
    return new Scale(new Vector(x,y,z), axis, rate);
}

function parseNumberProp(
    obj : any, 
    key : string, 
    def : number) : number{
    if (obj[key] == null){
        return def;
    }
    const num = Number(obj[key]);
    if (isNaN(num)){
        return def;
    }
    return num;
}

function parseAxis(axisStr : string, def : SheerAxis){
    try {
        return sheerAxisFromString(axisStr);
    }
    catch (error){
        return def;
    }
}