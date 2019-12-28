import { Parser } from "./Parser";
import { tokenize } from "./tokenizer";

export function makeParser(arg : string | Parser){
    if (typeof arg === 'string'){
        return new Parser(tokenize(arg));
    }
    return arg;
}