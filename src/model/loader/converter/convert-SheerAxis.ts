import { SheerAxis } from "../../SheerAxis";

const stringPairs : { [key:string] : SheerAxis }= {
    'SHEER_None': SheerAxis.None,
    'SHEER_XY' : SheerAxis.SheerXY,
    'SHEER_XZ' : SheerAxis.SheerXZ,
    'SHEER_YX' : SheerAxis.SheerYX,
    'SHEER_YZ' : SheerAxis.SheerYZ,
    'SHEER_ZX' : SheerAxis.SheerZX,
    'SHEER_ZY' : SheerAxis.SheerZY,
}

const sheerToString : string[] = [];

for (const str in stringPairs){
    const sheer = stringPairs[str];
    sheerToString[sheer] = str;
}

export function sheerAxisToString(sheerAxis : SheerAxis) : string 
{
    return sheerToString[sheerAxis];
}

export function sheerAxisFromString(str : string) : SheerAxis {
    const result = stringPairs[str];
    if (result == null){
        throw new Error('invalid argument ' + str);
    }
    return result;
}