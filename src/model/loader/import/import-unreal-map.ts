import { UnrealMap } from "../../UnrealMap"
import { GenericParser } from "../common/GenericParser"
import { importActor } from "./import-actor"
import { makeParser } from "./parser-helper"

export function importUnrealMap(arg : string | GenericParser) : UnrealMap {
    const unrealMap = new UnrealMap()
    const parser = makeParser(arg)

    parser.accept_and_move_to_next("Begin")
    parser.accept_and_move_to_next("Map")

    while(true){
        const currentToken = parser.get_current_token()
        const nextToken = parser.get_relative_token(+1)
        if (currentToken == "Begin" && nextToken == "Actor"){
            const actor = importActor(parser)
            unrealMap.actors.push(actor)
        } else {
            break
        }
    }

    parser.accept_and_move_to_next("End")
    parser.accept_and_move_to_next("Map")

    return unrealMap
}
