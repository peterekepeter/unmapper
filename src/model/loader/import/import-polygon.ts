import { Polygon } from "../../Polygon";
import { makeParser } from "./parser-helper";
import { Parser } from "./Parser";
import { importVector } from "./import-vector";

export function importPolygon(arg : string | Parser) : Polygon {
    const parser = makeParser(arg);
    const result = new Polygon();

    parser.acceptAndMoveToNext("Begin");
    parser.acceptAndMoveToNext("Polygon");

    while(true){
        const key = parser.getCurrentToken();
        if (key == "End"){
            break;
        }
        parser.moveToNext();
        switch(key){
            case "Flags": 
                parser.acceptAndMoveToNext("=");
                result.flags = parser.parseIntAndMoveToNext();
                break;
            case "Link": 
                parser.acceptAndMoveToNext("=");
                result.link = parser.parseIntAndMoveToNext();
                break;
            case "Item":
                parser.acceptAndMoveToNext("=");
                result.item = parser.getCurrentTokenAndMoveToNext();
                break;
            case "Texture":
                parser.acceptAndMoveToNext("=");
                result.texture = parser.getCurrentTokenAndMoveToNext();
                break
            case "Origin":
                result.origin = importVector(parser, 0);
                break;
            case "Normal":
                result.normal = importVector(parser, 0);
                break;
            case "TextureU":
                result.textureU = importVector(parser, 0);
                break;
            case "TextureV":
                result.textureV = importVector(parser, 0);
                break;
            case "Vertex":
                result.vertexes.push(importVector(parser, 0));
                break;
            case "Pan":
                parser.acceptAndMoveToNext("U");
                parser.acceptAndMoveToNext("=");
                result.panU = parser.parseFloatAndMoveToNext();
                parser.acceptAndMoveToNext("V");
                parser.acceptAndMoveToNext("=");
                result.panV = parser.parseFloatAndMoveToNext();
                break;
            default:
                throw "Unknown polygon property: " + key;
        }
    }
    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("Polygon");
    return result;
}