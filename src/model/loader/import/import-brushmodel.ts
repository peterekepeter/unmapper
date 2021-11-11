import { brushToPolygonData, polygonDataToBrush } from "../../brush-convert"
import { BrushModel } from "../../BrushModel"
import { BrushPolygonData } from "../../BrushPolygonData"
import { GenericParser } from "../common/GenericParser"
import { importPolygon } from "./import-polygon"
import { makeParser } from "./parser-helper"

export function importBrushModel(arg : string | GenericParser) : BrushModel {
    const parser = makeParser(arg)
    let brushName = null
    let brush : BrushModel = null

    parser.accept_and_move_to_next("Begin")
    parser.accept_and_move_to_next("Brush")

    while(true){
        const key = parser.get_current_token()
        if (key == "End"){
            break
        }
        switch(key){
            case "Name": 
                parser.move_to_next()
                parser.accept_and_move_to_next("=")
                brushName = parser.get_current_token_and_move_to_next()
                break
            case "Begin":
                brush = polygonDataToBrush(parsePolygons(parser))
                break
            default:
                throw "Unknown brush model property: " + key
        }
    }
    parser.accept_and_move_to_next("End")
    parser.accept_and_move_to_next("Brush")
    if (!brush) {
        brush = new BrushModel()
    }
    if (brushName) {
        brush.name = brushName
    }
    return brush
}

function parsePolygons(parser : GenericParser) : BrushPolygonData[] {
    const result : BrushPolygonData[] = []
    parser.accept_and_move_to_next("Begin")
    parser.accept_and_move_to_next("PolyList")

    while (parser.get_current_token() != "End"){
        result.push(importPolygon(parser))
    }
    
    parser.accept_and_move_to_next("End")
    parser.accept_and_move_to_next("PolyList")
    return result
}
