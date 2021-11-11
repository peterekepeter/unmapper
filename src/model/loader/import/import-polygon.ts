import { BrushPolygonData } from "../../BrushPolygonData"
import { GenericParser } from "../common/GenericParser"
import { importVector } from "./import-vector"
import { makeParser } from "./parser-helper"

export function importPolygon(arg : string | GenericParser) : BrushPolygonData {
    const parser = makeParser(arg)
    const result = new BrushPolygonData()

    parser.accept_and_move_to_next("Begin")
    parser.accept_and_move_to_next("Polygon")

    while(true){
        const key = parser.get_current_token()
        if (key == "End"){
            break
        }
        parser.move_to_next()
        switch(key){
            case "Flags": 
                parser.accept_and_move_to_next("=")
                result.flags = parser.parse_int_and_move_to_next()
                break
            case "Link": 
                parser.accept_and_move_to_next("=")
                result.link = parser.parse_int_and_move_to_next()
                break
            case "Item":
                parser.accept_and_move_to_next("=")
                result.item = parser.get_current_token_and_move_to_next()
                break
            case "Texture":
                parser.accept_and_move_to_next("=")
                result.texture = parser.get_current_token_and_move_to_next()
                break
            case "Origin":
                result.origin = importVector(parser, 0)
                break
            case "Normal":
                result.normal = importVector(parser, 0)
                break
            case "TextureU":
                result.textureU = importVector(parser, 0)
                break
            case "TextureV":
                result.textureV = importVector(parser, 0)
                break
            case "Vertex":
                result.vertexes.push(importVector(parser, 0))
                break
            case "Pan":
                for (let i=0; i<2; i++){ //excepting a U and a V (2 props)
                    const token = parser.get_current_token()
                    if (token === "U"){
                        parser.move_to_next()
                        parser.accept_and_move_to_next("=")
                        result.panU = parser.parse_float_and_move_to_next()
                    } 
                    else if (token === "V") {
                        parser.move_to_next()
                        parser.accept_and_move_to_next("=")
                        result.panV = parser.parse_float_and_move_to_next()
                    }
                    else break // for
                }
                break // switch
            default:
                throw "Unknown polygon property: " + key
        }
    }
    parser.accept_and_move_to_next("End")
    parser.accept_and_move_to_next("Polygon")
    return result
}

