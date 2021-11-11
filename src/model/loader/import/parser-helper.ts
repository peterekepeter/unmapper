import { GenericParser } from "../common/GenericParser"
import { tokenize } from "./tokenizer"

export function makeParser(arg : string | GenericParser){
    if (typeof arg === 'string'){
        return new GenericParser(tokenize(arg))
    }
    return arg
}
