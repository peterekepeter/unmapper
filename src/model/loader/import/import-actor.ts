import { Actor } from "../../Actor"
import { GenericParser } from "../common/GenericParser"
import { csgOperationFromString } from "../converter/convert-CsgOperation"
import { importBrushModel } from "./import-brushmodel"
import { importRotation } from "./import-rotation"
import { importScale } from "./import-scale"
import { importSubobject } from "./import-subobject"
import { importVector } from "./import-vector"
import { makeParser } from "./parser-helper"

export function importActor(arg : GenericParser | string) : Actor {
    const parser = makeParser(arg)
    const actor = new Actor()
    parser.accept_and_move_to_next("Begin")
    parser.accept_and_move_to_next("Actor")
    let parsingProps = true 
    while (parsingProps){
        const key = parser.get_current_token()
        const operator = parser.get_relative_token(+1)
        if (operator === "("){
            parser.accept_and_move_to_next(key)
            parser.accept_and_move_to_next('(')
            const index = parser.parse_int_and_move_to_next()
            parser.accept_and_move_to_next(')')
            parser.accept_and_move_to_next('=')
            parseActorArrayProp(actor, key, index, parser)
        } else 
        if (operator === "="){
            parser.accept_and_move_to_next(key)
            parser.accept_and_move_to_next('=')
            parseActorProp(actor, key, parser)
        } else if (key == "Begin" && operator == "Brush"){
            actor.brushModel = importBrushModel(parser)
        } else if (key === "End"){
            parsingProps = false
        } else {
            parser.error('unable to parse actor')
        }
    }
    parser.accept_and_move_to_next("End")
    parser.accept_and_move_to_next("Actor")
    return actor
}

function parseActorProp(actor : Actor, key :string, parser : GenericParser){

    let value: string

    switch(key){

        case "Class": 
            actor.className = parser.get_current_token_and_move_to_next() 
            break

        case "Name": 
            actor.name = parser.get_current_token_and_move_to_next() 
            break
        
        case "Location":
            actor.location = importVector(parser, 0.0)
            break
        
        case "OldLocation":
            actor.oldLocation = importVector(parser, 0.0)
            break

        case "Group":
            actor.group = parseSetPropertyValue(parser)
            break

        case "CsgOper":
            actor.csgOperation = parseCsgOperation(parser)
            break

        case "PolyFlags":
            actor.polyFlags = parseInteger(parser)
            break

        case "MainScale": 
            actor.mainScale = importScale(parser)
            break
        
        case "PostScale": 
            actor.postScale = importScale(parser)
            break
            
        case "TempScale": 
            actor.tempScale = importScale(parser)
            break

        case "Rotation":
            actor.rotation = importRotation(parser)
            break

        case "PrePivot":
            actor.prePivot = importVector(parser, 0)
            break

        case "Brush":
            // TODO import reference
            parser.move_to_next() // just skip for now
            break

        default:
            value = parser.get_current_token()
            if (value === '('){
                value = importSubobject(parser)
            } else {
                parser.move_to_next()
            }
            actor.unsupportedProperties[key] = value
            break
    }
}

function parseActorArrayProp(actor : Actor, key:string, index:number, parser:GenericParser){

    let list: Array<unknown>
    let value: string

    switch(key)
    {
        default:
            list = actor.unsupportedProperties[key]
            if (list == null){
                list = actor.unsupportedProperties[key] = []
            }
            value = parser.get_current_token()
            if (value === '('){
                value = importSubobject(parser)
            } else {
                parser.move_to_next()
            }
            list[index] = value
            break
    }
}

function parseInteger(parser : GenericParser){
    const token = parser.get_current_token_and_move_to_next()
    return Number.parseInt(token)
}

function parseCsgOperation(parser : GenericParser)
{
    const token = parser.get_current_token()
    parser.move_to_next()
    return csgOperationFromString(token)
}

function parseSetPropertyValue(parser : GenericParser){
    const result : string[] = []
    let str : string[] = []
    while (true){
        const token = parser.get_current_token()
        const next = parser.get_relative_token(+1)
        if (next == '=' || token == "End" && next == "Actor"){
            break
        }
        if (token == ','){
            result.push(str.join(' '))
            str = []
        } else {
            str.push(token)
        }
        parser.move_to_next()
    }
    if (str.length != 0){
        result.push(str.join(' '))
    }
    return result
}
