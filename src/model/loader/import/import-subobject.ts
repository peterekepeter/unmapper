import { Parser } from "./Parser";
import { makeParser } from "./parser-helper";


export function importSubobject(arg : Parser | string) : { [key:string]: string } {
    const parser = makeParser(arg);
    const result : { [key:string]: string }= {};
    parser.acceptAndMoveToNext('(');
    let isSubobject = true;
    while (isSubobject){
        const key = parser.getCurrentTokenAndMoveToNext();
        if (key === ")"){
            isSubobject = false;
        } 
        else {
            parser.acceptAndMoveToNext('=');
            const value = parser.getCurrentTokenAndMoveToNext();
            if (value === ")"){
                throw new Error("Expecting object property value");
            }
            result[key] = value;
        }
    }
    return result;
}