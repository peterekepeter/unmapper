import { BrushModel } from "../BrushModel"
import { BrushPolygonUvData } from "../BrushPolygonUvData"
import { EditorError } from "../EditorError"
import { Vector } from "../Vector"


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

export function polygon_uv_from_vertex_uvs(vertexes: Vector[], uvs: Vector[]): BrushPolygonUvData {
    EditorError.if(vertexes.length != uvs.length)
    const [posA, posB, posC] = vertexes
    const [uvA, uvB, uvC] = uvs
    console.log('polygon_uv_from_vertex_uvs', vertexes, uvs)

    let textureU = Vector.UNIT_X, textureV = Vector.UNIT_Y

    let pa = posB.subtract_vector(posA)
    let ua = uvB.subtract_vector(uvA)
    let pb = posC.subtract_vector(posB)
    let ub = uvC.subtract_vector(uvB)
    let pc = posA.subtract_vector(posC)
    let uc = uvA.subtract_vector(uvC)

    printTable(pa, ua, pb, ub, pc, uc)

    {
        const s = pb.x / pa.x
        pb = pb.subtract_vector(pa.scale(s))
        ub = ub.subtract_vector(ua.scale(s))
    }

    {
        const s = pc.x / pa.x
        pc = pc.subtract_vector(pa.scale(s))
        uc = uc.subtract_vector(ua.scale(s))
    }

    {
        const s = pa.y / pb.y
        pa = pa.subtract_vector(pb.scale(s))
        ua = ua.subtract_vector(ub.scale(s))
    }

    {
        const s = pc.y / pb.y
        pc = pc.subtract_vector(pb.scale(s))
        uc = uc.subtract_vector(ub.scale(s))
    }

    {
        const s = pc.y / pb.y
        pc = pc.subtract_vector(pb.scale(s))
        uc = uc.subtract_vector(ub.scale(s))
    }

    if (pa.x !== 0) {
        ua = ua.scale(1 / pa.x)
        pa = Vector.UNIT_X
    } else {
        pb = Vector.ZERO
        ub = Vector.ZERO
    }

    if (pb.y !== 0) {
        ub = ub.scale(1 / pb.y)
        pb = Vector.UNIT_Y
    } else {
        pb = Vector.ZERO
        ub = Vector.ZERO
    }

    if (pc.z !== 0) {
        uc = uc.scale(1 / pc.y)
        pc = Vector.UNIT_Y
    } else {
        pc = Vector.ZERO
        uc = Vector.ZERO
    }

    printTable(pa, ua, pb, ub, pc, uc)

    textureU = new Vector(ua.x, ub.x, uc.x)
    textureV = new Vector(ua.y, ub.y, uc.y)

    // origin should be the world position where UV is ZERO
    const origin = polygon_uv_from_vertex_uvs_origin(vertexes, uvs);

    // this algorithm applies panning by moving the origin
    // so there is no need for these additional pans
    const panU = 0, panV = 0

    const result: BrushPolygonUvData = { origin, panU, panV, textureU, textureV }

    // but in some degenerate cases we might need to adjust
    const uv = get_vertex_uv(result, posA)
    result.panU = uvA.x - uv.x
    result.panV = uvA.y - uv.y

    return result;
}

export function polygon_uv_from_vertex_uvs_origin(vertexes: Vector[], uvs: Vector[]): Vector {
    EditorError.if(vertexes.length != uvs.length)
    const [posA, posB, posC] = vertexes
    const [uvA, uvB, uvC] = uvs

    let textureU: Vector, textureV: Vector

    // find polygon UV vectors textureU and textureV
    {
        let dpAB = posB.subtract_vector(posA)
        let dpAC = posC.subtract_vector(posA)
        let duAB = uvB.subtract_vector(uvA)
        let duAC = uvC.subtract_vector(uvA)
    
        if (duAB.x === 0 && duAC.x !== 0) {
            [dpAB, dpAC, duAB, duAC] = [dpAC, dpAB, duAC, duAB]
        }
    
        if (duAC.x !== 0) {
            EditorError.if(duAB.x === 0, 'polygon has degenerate vertex UV')
            const reduct01 = duAC.x / duAB.x
            dpAC = dpAC.subtract_vector(dpAB.scale(reduct01))
            duAC = duAC.subtract_vector(duAB.scale(reduct01))
        }
    
        if (duAB.y !== 0) {
            EditorError.if(duAC.y === 0, 'polygon has degenerate vertex UV')
            const reduct10 = duAB.y / duAC.y
            dpAB = dpAB.subtract_vector(dpAC.scale(reduct10))
            duAB = duAB.subtract_vector(duAC.scale(reduct10))
        }
    
        if (duAB.x !== 1) {
            const scaleAB = 1 / duAB.x
            dpAB = dpAB.scale(scaleAB)
            duAB = duAB.scale(scaleAB)
        }
    
        if (duAC.y !== 1) {
            const scaleAC = 1 / duAC.y
            dpAC = dpAC.scale(scaleAC)
            duAC = duAC.scale(scaleAC)
        }
        textureU = dpAB
        textureV = dpAC
    }

    // origin should be the world position where UV is ZERO
    return posA
        .subtract_vector(textureU.scale(uvA.x))
        .subtract_vector(textureV.scale(uvA.y))

}

function printTable(pa: Vector, ua: Vector, pb: Vector, ub: Vector, pc: Vector, uc: Vector) {
    console.table([
        [pa.x, pa.y, pa.z, ua.x, ua.y],
        [pb.x, pb.y, pb.z, ub.x, ub.y],
        [pc.x, pc.y, pc.z, uc.x, uc.y]
    ])
}