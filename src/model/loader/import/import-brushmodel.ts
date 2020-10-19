import { makeParser } from "./parser-helper";
import { Parser } from "./Parser";
import { BrushModel } from "../../BrushModel";
import { importPolygon } from "./import-polygon";
import { BrushPolygonData } from "../../BrushPolygonData";
import { brushToPolygonData, polygonDataToBrush } from "../../brush-convert";

export function importBrushModel(arg : string | Parser) : BrushModel {
    const parser = makeParser(arg);
    let brushName = null;
    let brush : BrushModel = null;

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
                brushName = parser.getCurrentTokenAndMoveToNext();
                break;
            case "Begin":
                brush = polygonDataToBrush(parsePolygons(parser));
                break;
            default:
                throw "Unknown brush model property: " + key;
        }
    }
    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("Brush");
    if (!brush) {
        brush = new BrushModel();
    }
    if (brushName) {
        brush.name = brushName;
    }
    return brush;
}

function parsePolygons(parser : Parser) : BrushPolygonData[] {
    const result : BrushPolygonData[] = [];
    parser.acceptAndMoveToNext("Begin");
    parser.acceptAndMoveToNext("PolyList");

    while (parser.getCurrentToken() != "End"){
        result.push(importPolygon(parser));
    }
    
    parser.acceptAndMoveToNext("End");
    parser.acceptAndMoveToNext("PolyList");
    return result;
}