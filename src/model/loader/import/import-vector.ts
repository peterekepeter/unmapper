import { Vector } from "../../Vector";
import { Parser } from "./Parser";
import { makeParser } from "./parser-helper";
import { importSubobject } from "./import-subobject";

export function importVector(input : string | Parser, defaultValue : number) : Vector {
    const parser = makeParser(input);
    const firstToken = parser.getCurrentToken();
    console.log('first token', firstToken);
    if (firstToken == '('){
        return parseObjectVector(parser, defaultValue);
    } else {
        return parseArrayVector(parser);
    }
}

function parseObjectVector(parser: Parser, defaultValue: number){
    console.log('first token ojb')
    const {X,Y,Z} = importSubobject(parser);
    let x = parseOrDefault(X, defaultValue);
    let y = parseOrDefault(Y, defaultValue);
    let z = parseOrDefault(Z, defaultValue);
    return new Vector(x,y,z);
}

function parseArrayVector(parser:Parser){
    console.log('array mode')
    const x = parser.parseFloatAndMoveToNext();
    const y = parser.parseFloatAndMoveToNext();
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

export function vectorFromString(input : string, defaultValue : number) : Vector {
    if (defaultValue == null){
        defaultValue = 0;
    }
    const components = input.split(',');
    const parsed = [defaultValue, defaultValue, defaultValue];
    var resultIndex = 0;
    for (let component of components){
        
        // strip parantehsis
        if (component.startsWith('(')){
            component = component.substring(1);
        }

        // detect and strip component key
        if (component.startsWith("X=")){
            resultIndex = 0;
            component = component.substring(2);
        } else if (component.startsWith("Y=")){
            resultIndex = 1;
            component = component.substring(2);
        } else if(component.startsWith("Z=")){
            resultIndex = 2;
            component = component.substring(2);
        } else {
            // no component key
            if (resultIndex > 2) {
                resultIndex = 0;
            }
        }

        parsed[resultIndex] = Number.parseFloat(component);
        resultIndex ++;
    }
    return Vector.fromArray(parsed);
}