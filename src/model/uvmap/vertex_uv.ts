import { BrushModel } from "../BrushModel"
import { BrushPolygonUvData } from "../BrushPolygonUvData"
import { EditorError } from "../EditorError"
import { Vector } from "../Vector"


export function get_brush_polygon_vertex_uvs(model: BrushModel, polygon_index: number): Vector[] {
    const poly = model.polygons[polygon_index]
    return poly.vertexes.map(vertex_index => {
        const vertex = model.vertexes[vertex_index]
        const delta = vertex.position.subtract_vector(poly.origin)
        const u = delta.dot(poly.textureU) + poly.panU
        const v = delta.dot(poly.textureV) + poly.panV
        return new Vector(u, v, 0)
    })
}

export function set_brush_polygon_vertex_uvs(model: BrushModel, polygon_index: number, uvs: Vector[]): BrushModel {
    const poly = model.polygons[polygon_index]
    throw new Error('not implemented')
    return null
}

export function polygon_uv_from_vertex_uvs(vertexes: Vector[], uvs: Vector[]): BrushPolygonUvData {
    EditorError.if(vertexes.length != uvs.length)
    const [posA, posB, posC] = vertexes
    const [uvA, uvB, uvC] = uvs

    let dpAB = posB.subtract_vector(posA)
    let dpAC = posC.subtract_vector(posA)
    let duAB = uvB.subtract_vector(uvA)
    let duAC = uvC.subtract_vector(uvA)

    // considering the segmented matrix:
    // [
    //   dpAB.x dpAB.y dpAB.z | duAB.x duAB.y
    //   dpAC.x dpAC.y dpAC.z | duAC.x duAC.y 
    // ]
    // using row operations reduce the right segment to identity
    // and you'll get the polygon basis vectors for UV space on the left
    
    if (duAB.x === 0 && duAC.x !== 0){
        [dpAB, dpAC, duAB, duAC] = [dpAC, dpAB, duAC, duAB]
    }

    if (duAC.x !== 0){
        EditorError.if(duAB.x === 0, 'polygon has degenerate vertex UV')
        const reduct01 = duAC.x/duAB.x
        dpAC = dpAC.subtract_vector(dpAB.scale(reduct01))
        duAC = duAC.subtract_vector(duAB.scale(reduct01))
    }

    if (duAB.y !== 0){
        EditorError.if(duAC.y === 0, 'polygon has degenerate vertex UV')
        const reduct10 = duAB.y/duAC.y
        dpAB = dpAB.subtract_vector(dpAC.scale(reduct10))
        duAB = duAB.subtract_vector(duAC.scale(reduct10))
    }

    if (duAB.x !== 1){
        const scaleAB = 1/duAB.x
        dpAB = dpAB.scale(scaleAB)
        duAB = duAB.scale(scaleAB)
    }

    if (duAC.y !== 1){
        const scaleAC = 1/duAC.y
        dpAC = dpAC.scale(scaleAC)
        duAC = duAC.scale(scaleAC)
    }

    // TODO using the original vertexes and uvs, find the origin

    return {
        origin: Vector.ZERO,
        panU: 0,
        panV: 0,
        textureU: dpAB,
        textureV: dpAC
    }
}