import { Vector } from "../../Vector"
import { GenericParser } from "../common/GenericParser"
import { importSubobject } from "./import-subobject"
import { makeParser } from "./parser-helper"

export function importVector(input : string | GenericParser, defaultValue : number) : Vector {
    const parser = makeParser(input)
    const firstToken = parser.get_current_token()
    if (firstToken == '('){
        return parseObjectVector(parser, defaultValue)
    } else {
        return parseArrayVector(parser)
    }
}

function parseObjectVector(parser: GenericParser, defaultValue: number){
    const { X, Y, Z } = importSubobject(parser)
    const x = parseOrDefault(X, defaultValue)
    const y = parseOrDefault(Y, defaultValue)
    const z = parseOrDefault(Z, defaultValue)
    return new Vector(x, y, z)
}

function parseArrayVector(parser:GenericParser){
    const x = parser.parse_float_and_move_to_next()
    parser.accept_and_move_to_next(',')
    const y = parser.parse_float_and_move_to_next()
    parser.accept_and_move_to_next(',')
    const z = parser.parse_float_and_move_to_next()
    return new Vector(x, y, z)
}

function parseOrDefault(input : string | null | undefined, defaultValue : number) : number {
    const result = input != null ? Number.parseFloat(input) : defaultValue
    if (isNaN(result)){
        throw new Error(`Failed to parse float value from \"${input}\"`)
    }
    return result
}
