import { Parser } from "./Parser";
import { makeParser } from "./parser-helper";

export function importSubobject(arg : Parser | string) {
    const parser = makeParser(arg);
    parser.acceptAndMoveToNext('(');
    return importSubobjectBody(parser);
}

function importSubobjectBody(parser : Parser)
{
    const result : any = {};
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
            if (value === "("){
                result[key] = importSubobjectBody(parser);
            } else {
                result[key] = value;
            }

            // skip commas
            if (parser.getCurrentToken() === ','){
                parser.moveToNext();
            }
        }
    }
    return result;
}