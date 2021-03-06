import { makeParser } from "./parser-helper";
import { Actor } from "../../Actor";
import { Parser } from "./Parser";
import { importSubobject } from "./import-subobject";
import { importVector } from "./import-vector";
import { importBrushModel } from "./import-brushmodel";
import { csgOperationFromString } from "../converter/convert-CsgOperation";
import { importScale } from "./import-scale";
import { importRotation } from "./import-rotation";

export function importActor(arg : Parser | string) : Actor {
    const parser = makeParser(arg);
    const actor = new Actor();
    parser.acceptAndMoveToNext("Begin");
    parser.acceptAndMoveToNext("Actor");
    let parsingProps = true; 
    while (parsingProps){
        const key = parser.getCurrentToken();
        const operator = parser.getRelativeToken(+1);
        if (operator === "("){
            parser.acceptAndMoveToNext(key);
            parser.acceptAndMoveToNext('(');
            const index = parser.parseIntAndMoveToNext();
            parser.acceptAndMoveToNext(')')
            parser.acceptAndMoveToNext('=')
            parseActorArrayProp(actor, key, index, parser);
        } else 
        if (operator === "="){
            parser.acceptAndMoveToNext(key);
            parser.acceptAndMoveToNext('=');
            parseActorProp(actor, key, parser);
        } else if (key == "Begin" && operator == "Brush"){
            actor.brushModel = importBrushModel(parser);
        } else if (key === "End"){
            parsingProps = false;
        } else {
            parser.error('unable to parse actor');
        }
    }
    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("Actor");
    return actor;
}


function parseActorProp(actor : Actor, key :string, parser : Parser){

    let value: string;

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

        case "PolyFlags":
            actor.polyFlags = parseInteger(parser);
            break;

        case "MainScale": 
            actor.mainScale = importScale(parser);
            break;
        
        case "PostScale": 
            actor.postScale = importScale(parser);
            break;
            
        case "TempScale": 
            actor.tempScale = importScale(parser);
            break;

        case "Rotation":
            actor.rotation = importRotation(parser);
            break;

        case "PrePivot":
            actor.prePivot = importVector(parser, 0);
            break;

        default:
            value = parser.getCurrentToken();
            if (value === '('){
                value = importSubobject(parser);
            } else {
                parser.moveToNext();
            }
            actor.unsupportedProperties[key] = value;
            break;
        }
}

function parseActorArrayProp(actor : Actor, key:string, index:number, parser:Parser){

    let list: Array<unknown>;
    let value: string;

    switch(key)
    {
        default:
            list = actor.unsupportedProperties[key];
            if (list == null){
                list = actor.unsupportedProperties[key] = [];
            }
            value = parser.getCurrentToken();
            if (value === '('){
                value = importSubobject(parser);
            } else {
                parser.moveToNext();
            }
            list[index] = value;
            break;
    }
}

function parseInteger(parser : Parser){
    const token = parser.getCurrentTokenAndMoveToNext();
    return Number.parseInt(token);
}

function parseCsgOperation(parser : Parser)
{
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