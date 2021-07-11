import { BrushModel } from "../BrushModel"
import { BrushPolygonUvData } from "../BrushPolygonUvData"
import { Vector } from "../Vector"
import { polygon_uv_from_vertex_uvs } from "./polygon_uv_from_vertex_uvs"


export function get_brush_polygon_vertex_uvs(model: BrushModel, polygon_index: number): Vector[] {
    const poly = model.polygons[polygon_index]
    return poly.vertexes.map(vertex_index => {
        const vertex = model.vertexes[vertex_index]
        return get_vertex_uv(poly, vertex.position)
    })
}

export function get_vertex_uv(poly: BrushPolygonUvData, vertex: Vector): Vector {
    const delta = vertex.subtract_vector(poly.origin)
    const u = delta.dot(poly.textureU) + poly.panU
    const v = delta.dot(poly.textureV) + poly.panV
    return new Vector(u, v, 0)
}

export function set_brush_polygon_vertex_uvs(model: BrushModel, polygon_index: number, uvs: Vector[]): BrushModel {
    const poly = model.polygons[polygon_index]
    const props = polygon_uv_from_vertex_uvs(poly.vertexes.map(i => model.vertexes[i].position), uvs)
    const next_model = model.shallow_copy()
    next_model.polygons = [...model.polygons]
    const next_poly = poly.shallow_copy()
    next_model.polygons[polygon_index] = next_poly
    next_poly.textureU = props.textureU
    next_poly.textureV = props.textureV
    next_poly.origin = props.origin
    next_poly.panU = props.panU
    next_poly.panV = props.panV
    return next_model
}
