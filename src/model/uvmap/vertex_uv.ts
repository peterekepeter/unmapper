import { BrushModel } from "../BrushModel"
import { BrushPolygonUvData } from "../BrushPolygonUvData"
import { EditorError } from "../EditorError"
import { Vector } from "../Vector"


export function get_brush_polygon_vertex_uvs(model:BrushModel, polygon_index: number): Vector[] {
    const poly = model.polygons[polygon_index]
    return poly.vertexes.map(vertex_index => {
        const vertex = model.vertexes[vertex_index]
        const delta = vertex.position.subtract_vector(poly.origin)
        const u = delta.dot(poly.textureU) + poly.panU
        const v = delta.dot(poly.textureV) + poly.panV
        return new Vector(u,v,0)
    })
}

export function set_brush_polygon_vertex_uvs(model:BrushModel, polygon_index:number, uvs: Vector[]): BrushModel {
    const poly = model.polygons[polygon_index]
    throw new Error('not implemented')
    return null
}

export function polygon_uv_from_vertex_uvs(vertexes: Vector[], uvs: Vector[]): BrushPolygonUvData
{
    EditorError.if(vertexes.length != uvs.length)
    const [posA, posB, posC] = vertexes
    const [uvA, uvB, uvC] = uvs


    return {
        origin: Vector.ZERO,
        panU: 0,
        panV: 0,
        textureU: Vector.UNIT_X,
        textureV: Vector.UNIT_Y
    }
}