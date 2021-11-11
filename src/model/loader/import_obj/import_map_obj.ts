import { Actor } from "../../Actor"
import { BrushModel } from "../../BrushModel"
import { BrushPolygon } from "../../BrushPolygon"
import { BrushVertex } from "../../BrushVertex"
import { KnownClasses } from "../../KnownClasses"
import { UnrealMap } from "../../UnrealMap"
import { Vector } from "../../Vector"
import { GenericParser } from "../common/GenericParser"
import { tokenize_wavefront_obj, WavefrontCommandToken as T } from "./tokenize_wavefront_obj"

type ObjParserState = {
    parser: GenericParser,
    result: UnrealMap,
};

export function import_map_obj(obj_data: string): UnrealMap {
    const result = new UnrealMap()
    result.actors = []
    const tokens = tokenize_wavefront_obj(obj_data)
    const parser = new GenericParser(tokens)
    parse_map_obj({ result, parser })

    return result
}

function parse_map_obj(state: ObjParserState) {
    let has_tokens = true
    while (has_tokens){
        switch(state.parser.get_current_token()){
            case T.BeginObject:
                state.result.actors.push(parse_obj_actor(state.parser))
                break
            default:
                next_line(state.parser)
                break
            case undefined:
                has_tokens = false
                break
        }
    }

}

function parse_obj_actor(parser: GenericParser): Actor {
    parser.accept_and_move_to_next(T.BeginObject)
    const actor = new Actor()
    actor.className = KnownClasses.Brush
    const token = parser.get_current_token()
    if (token !== T.End) {
        actor.name = token
    } else {
        actor.name = "Brush"
    }
    const brush = new BrushModel()
    actor.brushModel = brush
    
    let parsing_object = true
    while (parsing_object){
        switch (parser.get_current_token()){
            case T.BeginVertex:
                brush.vertexes.push(parse_obj_vertex(parser))
                break
            case T.BeginPolygon:
                brush.polygons.push(parse_obj_polygon(parser, brush))
                break
            default: 
                next_line(parser)
                break
            case undefined:
            case T.BeginObject:
                parsing_object = false
                break
        }
    }
    return actor
}

function next_line(parser: GenericParser) {
    let token = parser.get_current_token()
    while (token != T.End && token != null){
        parser.move_to_next()
        token = parser.get_current_token()
    }
    if (token != null){
        parser.accept_and_move_to_next(T.End)
    }
}

function parse_obj_vertex(parser: GenericParser): BrushVertex {
    parser.accept_and_move_to_next(T.BeginVertex)
    let x = 0, y = 0, z = 0
    if (parser.get_current_token() != T.End)
    {
        x = parser.parse_float_and_move_to_next()
    }
    if (parser.get_current_token() != T.End)
    {
        y = parser.parse_float_and_move_to_next()
    }
    if (parser.get_current_token() != T.End)
    {
        z = parser.parse_float_and_move_to_next()
    }
    return new BrushVertex(new Vector(x, y, z))
}

function parse_obj_polygon(parser: GenericParser, brush: BrushModel): BrushPolygon {
    parser.accept_and_move_to_next(T.BeginPolygon)
    const vertex_index = []
    const texture_index = []
    const normal_index = []
    let token = parser.get_current_token()
    while (token !== T.End && token != null){
        vertex_index.push(parser.parse_int_and_move_to_next())
        if (parser.get_current_token() === T.End){ break }
        if (parser.get_current_token() === '/'){
            parser.accept_and_move_to_next('/')
            if (parser.get_current_token() !== '/'){
                texture_index.push(parser.parse_int_and_move_to_next())
            }
            if (parser.get_current_token() === '/'){
                parser.accept_and_move_to_next('/')
                normal_index.push(parser.parse_int_and_move_to_next())
            }
        }
        token = parser.get_current_token()
    }
    const polygon = new BrushPolygon()
    polygon.vertexes = vertex_index
    return polygon
}

