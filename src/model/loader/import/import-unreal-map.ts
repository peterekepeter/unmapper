import { UnrealMap } from "../../UnrealMap";
import { Parser } from "./Parser";
import { makeParser } from "./parser-helper";
import { importActor } from "./import-actor";


export function importUnrealMap(arg : string | Parser) : UnrealMap {
    const unrealMap = new UnrealMap();
    const parser = makeParser(arg);

    parser.acceptAndMoveToNext("Begin");
    parser.acceptAndMoveToNext("Map");

    while(true){
        const currentToken = parser.getCurrentToken();
        const nextToken = parser.getRelativeToken(+1);
        if (currentToken == "Begin" && nextToken == "Actor"){
            const actor = importActor(parser);
            unrealMap.actors.push(actor);
        } else {
            break;
        }
    }

    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("Map");

    return unrealMap;
}
