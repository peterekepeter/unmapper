import { GenericParser } from "../common/GenericParser"
import { makeParser } from "./parser-helper"

export function importSubobject(arg : GenericParser | string) {
    const parser = makeParser(arg)
    parser.accept_and_move_to_next('(')
    return importSubobjectBody(parser)
}

function importSubobjectBody(parser : GenericParser)
{
    const result : any = {}
    let isSubobject = true
    while (isSubobject){
        const key = parser.get_current_token_and_move_to_next()
        if (key === ")"){
            isSubobject = false
        } 
        else {
            parser.accept_and_move_to_next('=')
            const value = parser.get_current_token_and_move_to_next()
            if (value === ")"){
                throw new Error("Expecting object property value")
            }
            if (value === "("){
                result[key] = importSubobjectBody(parser)
            } else {
                result[key] = value
            }

            // skip commas
            if (parser.get_current_token() === ','){
                parser.move_to_next()
            }
        }
    }
    return result
}
