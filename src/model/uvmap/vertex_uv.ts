import { BrushModel } from "../BrushModel"
import { Vector } from "../Vector"


export function get_brush_polygon_vertex_uvs(model:BrushModel, polygon_index: number): Vector[] {
    const poly = model.polygons[polygon_index]
    return poly.vertexes.map(vertex_index => {
        const vertex = model.vertexes[vertex_index]
        const delta = vertex.position.subtract_vector(poly.origin)
        const u = delta.dot(poly.textureU)
        const v = delta.dot(poly.textureV)
        return new Vector(u,v,0)
    });
}