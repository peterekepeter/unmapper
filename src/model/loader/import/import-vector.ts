import { Vector } from "../../Vector";
import { Parser } from "./Parser";
import { makeParser } from "./parser-helper";
import { importSubobject } from "./import-subobject";

export function importVector(input : string | Parser, defaultValue : number) : Vector {
    const parser = makeParser(input);
    const firstToken = parser.getCurrentToken();
    if (firstToken == '('){
        return parseObjectVector(parser, defaultValue);
    } else {
        return parseArrayVector(parser);
    }
}

function parseObjectVector(parser: Parser, defaultValue: number){
    const {X,Y,Z} = importSubobject(parser);
    let x = parseOrDefault(X, defaultValue);
    let y = parseOrDefault(Y, defaultValue);
    let z = parseOrDefault(Z, defaultValue);
    return new Vector(x,y,z);
}

function parseArrayVector(parser:Parser){
    const x = parser.parseFloatAndMoveToNext();
    parser.acceptAndMoveToNext(',');
    const y = parser.parseFloatAndMoveToNext();
    parser.acceptAndMoveToNext(',');
    const z = parser.parseFloatAndMoveToNext();
    return new Vector(x,y,z);
}

function parseOrDefault(input : string | null | undefined, defaultValue : number) : number {
    const result = input != null ? Number.parseFloat(input) : defaultValue;
    if (isNaN(result)){
        throw new Error(`Failed to parse float value from \"${input}\"`);
    }
    return result;
}