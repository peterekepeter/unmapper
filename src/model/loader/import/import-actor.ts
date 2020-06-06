import { makeParser } from "./parser-helper";
import { Actor } from "../../Actor";
import { Parser } from "./Parser";
import { importSubobject } from "./import-subobject";
import { importVector } from "./import-vector";
import { importBrushModel } from "./import-brushmodel";
import { CsgOperation } from "../../CsgOperation";
import { csgOperationFromString } from "../csgOperationStringConversion";

export function importActor(arg : Parser | string) : Actor {
    const parser = makeParser(arg);
    const actor = new Actor();
    parser.acceptAndMoveToNext("Begin");
    parser.acceptAndMoveToNext("Actor");
    let parsingProps = true; 
    while (parsingProps){
        const key = parser.getCurrentToken();
        const operator = parser.getRelativeToken(+1);
        if (operator === "="){
            parser.acceptAndMoveToNext(key);
            parser.acceptAndMoveToNext('=');
            parseActorProp(actor, key, parser);
        } else if (key == "Begin" && operator == "Brush"){
            actor.brushModel = importBrushModel(parser);
        } else {
            parsingProps = false;
        }
    }
    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("Actor");
    return actor;
}

function parseActorProp(actor : Actor, key :string, parser : Parser){
    
    switch(key){

        case "Class": 
            actor.className = parser.getCurrentTokenAndMoveToNext(); 
            break;

        case "Name": 
            actor.name = parser.getCurrentTokenAndMoveToNext(); 
            break;
        
        case "Location":
            actor.location = importVector(parser, 0.0);
            break;
        
        case "OldLocation":
            actor.oldLocation = importVector(parser, 0.0);
            break;

        case "Group":
            actor.group = parseSetPropertyValue(parser);
            break;

        case "CsgOper":
            actor.csgOperation = parseCsgOperation(parser);
            break;

        default:
            let value : string | object = parser.getCurrentToken();
            if (value === '('){
                value = importSubobject(parser);
            } else {
                parser.moveToNext();
            }
            actor.unsupportedProperties[key] = value;
            break;
        }
}

function parseCsgOperation(parser : Parser)
{
    let result : CsgOperation | null = null;
    const token = parser.getCurrentToken();
    parser.moveToNext();
    return csgOperationFromString(token);
}

function parseSetPropertyValue(parser : Parser){
    const result : string[] = [];
    let str : string[] = [];
    while (true){
        const token = parser.getCurrentToken();
        const next = parser.getRelativeToken(+1);
        if (next == '=' || token == "End" && next == "Actor"){
            break;
        }
        if (token == ','){
            result.push(str.join(' '));
            str = [];
        } else {
            str.push(token);
        }
        parser.moveToNext();
    }
    if (str.length != 0){
        result.push(str.join(' '));
    }
    return result;
}