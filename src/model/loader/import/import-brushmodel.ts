
import { Polygon } from "../../Polygon";
import { makeParser } from "./parser-helper";
import { Parser } from "./Parser";
import { BrushModel } from "../../BrushModel";
import { importPolygon } from "./import-polygon";

export function importBrushModel(arg : string | Parser) : BrushModel {
    const parser = makeParser(arg);
    const brushModel = new BrushModel();

    parser.acceptAndMoveToNext("Begin");
    parser.acceptAndMoveToNext("Brush");

    while(true){
        const key = parser.getCurrentToken();
        if (key == "End"){
            break;
        }
        switch(key){
            case "Name": 
                parser.moveToNext();
                parser.acceptAndMoveToNext("=");
                brushModel.name = parser.getCurrentTokenAndMoveToNext();
                break;
            case "Begin":
                brushModel.polygons = parsePolygons(parser);
                break;
            default:
                throw "Unknown brush model property: " + key;
        }
    }
    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("Brush");
    return brushModel;
}

function parsePolygons(parser : Parser) : Polygon[] {
    const result : Polygon[] = [];
    parser.acceptAndMoveToNext("Begin");
    parser.acceptAndMoveToNext("PolyList");

    while (parser.getCurrentToken() != "End"){
        result.push(importPolygon(parser));
    }
    
    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("PolyList");
    return result;
}