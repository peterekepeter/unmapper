import { CsgOperation } from "../CsgOperation";

const stringCsgPairs : { [key:string] : CsgOperation }= {
    'CSG_Active': CsgOperation.Active,
    'CSG_Add': CsgOperation.Add,
    'CSG_Subtract': CsgOperation.Subtract,
    'CSG_Intersect': CsgOperation.Intersect,
    'CSG_Deintersect': CsgOperation.Deintersect,
}

const csgToStringData : string[] = [];

for (const str in stringCsgPairs){
    const op = stringCsgPairs[str];
    csgToStringData[op] = str;
}

export function csgOperationToString(op : CsgOperation){
    return csgToStringData[op];
}

export function csgOperationFromString(str : string){
    const value = stringCsgPairs[str];
    if (value == null){
        throw new Error('unexpected value: ' + str);
    }
    return value;
}