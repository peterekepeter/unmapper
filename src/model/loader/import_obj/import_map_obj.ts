import { Actor } from "../../Actor"
import { calculate_polygon_center } from "../../algorithms/calculate_polygon_median"
import { calculate_polygon_normal } from "../../algorithms/calculate_polygon_normal"
import { BrushModel } from "../../BrushModel"
import { BrushPolygon } from "../../BrushPolygon"
import { BrushVertex } from "../../BrushVertex"
import { KnownClasses } from "../../KnownClasses"
import { UnrealMap } from "../../UnrealMap"
import { polygon_uv_from_vertex_uvs } from "../../uvmap/polygon_uv_from_vertex_uvs"
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
    const uv_data: Vector[] = []
    const normal_data: Vector[] = []
    actor.brushModel = brush
    let texture: string|null = null
    
    let parsing_object = true
    while (parsing_object){
        switch (parser.get_current_token()){
            case T.UseMaterial:
                texture = parse_obj_texture(parser, texture)
                break
            case T.BeginVertexTexture:
                uv_data.push(parse_obj_vertex_uv(parser))
                break
            case T.BeginVertexNormal:
                normal_data.push(parse_obj_vertex_normal(parser))
                break
            case T.BeginVertex:
                brush.vertexes.push(parse_obj_vertex_position(parser))
                break
            case T.BeginPolygon:
                brush.polygons.push(parse_obj_polygon(parser, brush, texture, uv_data, normal_data))
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
    actor.brushModel.rebuild_all_poly_edges()
    return actor
}

function parse_obj_texture(parser: GenericParser, texture: string) {
    parser.accept_and_move_to_next(T.UseMaterial)
    texture = parser.get_current_token()
    next_line(parser)
    return texture
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

function parse_obj_vertex_normal(parser: GenericParser): Vector {
    parser.accept_and_move_to_next(T.BeginVertexNormal)
    const normal = parse_vector(parser)
    next_line(parser)
    return normal.normalize()
}

function parse_obj_vertex_uv(parser: GenericParser): Vector {
    parser.accept_and_move_to_next(T.BeginVertexTexture)
    const result = parse_vector(parser)
    next_line(parser)
    return result
}

function parse_obj_vertex_position(parser: GenericParser): BrushVertex {
    parser.accept_and_move_to_next(T.BeginVertex)
    const result = parse_vector(parser)
    next_line(parser)
    return new BrushVertex(result)
}

function parse_vector(parser: GenericParser): Vector {
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
    return new Vector(x, y, z)
}

function parse_obj_polygon(parser: GenericParser, brush: BrushModel, texture: string, uv_data: Vector[], normal_data: Vector[]): BrushPolygon {
    parser.accept_and_move_to_next(T.BeginPolygon)
    const vertex_index = []
    const texture_index = []
    const normal_index = []
    let token = parser.get_current_token()
    while (token !== T.End && token != null){
        vertex_index.push(parser.parse_int_and_move_to_next()-1)
        if (parser.get_current_token() === T.End){ break }
        if (parser.get_current_token() === '/'){
            parser.accept_and_move_to_next('/')
            if (parser.get_current_token() !== '/'){
                texture_index.push(parser.parse_int_and_move_to_next()-1)
            }
            if (parser.get_current_token() === '/'){
                parser.accept_and_move_to_next('/')
                normal_index.push(parser.parse_int_and_move_to_next()-1)
            }
        }
        token = parser.get_current_token()
    }
    next_line(parser)

    const polygon = new BrushPolygon()
    polygon.vertexes = vertex_index
    polygon.texture = texture

    const vertex_data = brush.vertexes.map(v => v.position)

    // median
    polygon.median = calculate_polygon_center(brush.vertexes, polygon)

    // normal
    if (normal_index.length === vertex_index.length) {
        let x=0, y=0, z=0
        for (const i of normal_index){
            const vertex_normal = normal_data[i]
            x += vertex_normal.x
            y += vertex_normal.y
            z += vertex_normal.z
        }
        polygon.normal = new Vector(x, y, z).normalize()
    } else {
        polygon.normal = calculate_polygon_normal(brush.vertexes, polygon)
    }

    // UV
    if (texture_index.length === vertex_index.length){
        const vertexes = vertex_index.map(i => vertex_data[i])
        const uvs = texture_index.map(i => uv_data[i])
        const polygon_uv = polygon_uv_from_vertex_uvs(vertexes, uvs)
        polygon.textureU = polygon_uv.textureU
        polygon.textureV = polygon_uv.textureV
        polygon.panU = polygon_uv.panU
        polygon.panV = polygon_uv.panV
        polygon.origin = polygon_uv.origin
    } else {
        polygon.origin = polygon.median
        polygon.panU = 0
        polygon.panV = 0
        polygon.textureU = vertex_data[polygon.vertexes[1]].subtract_vector(vertex_data[polygon.vertexes[0]]).normalize()
        polygon.textureV = polygon.textureU.cross(polygon.normal).normalize()
    }
    return polygon
}

