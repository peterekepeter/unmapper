import { BrushPolygonUvData } from "../BrushPolygonUvData"
import { EditorError } from "../error/EditorError"
import { Vector } from "../Vector"
import { get_vertex_uv } from "./vertex_uv"

const abs = Math.abs

export function polygon_uv_from_vertex_uvs(vertexes: Vector[], uvs: Vector[]): BrushPolygonUvData {
    return impl_v3(vertexes, uvs)
}

export function impl_v3(verts: Vector[], vertex_uvs: Vector[]): BrushPolygonUvData {
    EditorError.if(verts.length != vertex_uvs.length)
    const v1 = impl_v1(verts, vertex_uvs) // assumes v1 finds origin correctly
    const origin = v1.origin

    let pvs = verts.map(v => v.subtract_vector(origin))
    let uvs = [...vertex_uvs]

    // filter vector candidates until 2 remain
    let iteration_count = 0
    if (pvs.length !== 2){
        // eliminate zeroes
        const zeroes: number[] = []
        for (let i=0; i<pvs.length; i++){
            if (pvs[i].equals(Vector.ZERO) || uvs[i].equals(Vector.ZERO)){
                zeroes.push(i)
            }
        }
        if (zeroes.length > 0){
            pvs=pvs.filter((_, i) => !zeroes.includes(i))
            uvs=uvs.filter((_, i) => !zeroes.includes(i))
        }
    }
    while (pvs.length !== 2){
        EditorError.if(pvs.length < 2)
        EditorError.if(iteration_count > 100)

        // compare each vector
        const lengths = pvs.map(p => p.length())
        const max_length = lengths.reduce((a,c) => c > a ? c : a,lengths[0])
        const normalized_lengths = lengths.map(l => l/max_length)
        const normalized_pvs = pvs.map(p => p.normalize())
        let worst_score = 1
        let eliminate_index = 0
        for (let i=0; i<pvs.length; i++){
            const distance = normalized_lengths[i]
            for (let j=0; j<pvs.length; j++){
                if (i === j) continue
                const perpenticular = 1-abs(normalized_pvs[i].dot(normalized_pvs[j]))
                const score = distance * perpenticular
                if (score < worst_score){
                    worst_score = score
                    eliminate_index = i
                }
            }
        }
        pvs=pvs.filter((_, i) => i!==eliminate_index)
        uvs=uvs.filter((_, i) => i!==eliminate_index)

        iteration_count++
    }

    // add normal with Z UV
    const normal = verts[1].subtract_vector(verts[0]).cross(
        verts[2].subtract_vector(verts[0])).normalize()
    pvs.push(normal)
    uvs = [...uvs, Vector.UNIT_Z]

    // row operations
    if (abs(pvs[0].x) < abs(pvs[1].x)) swap(0,1)
    if (abs(pvs[0].x) < abs(pvs[2].x)) swap(0,2)

    EditorError.if(pvs[0].x === 0)
    
    divide(0,pvs[0].x)
    add(0,1,-pvs[1].x)
    add(0,2,-pvs[2].x)

    if (abs(pvs[1].y) < abs(pvs[2].y)) swap(1,2)

    EditorError.if(pvs[1].y === 0)

    divide(1,pvs[1].y)
    add(1,0,-pvs[0].y)
    add(1,2,-pvs[2].y)

    EditorError.if(pvs[2].z === 0)

    divide(2,pvs[2].z)
    add(2,1,-pvs[1].z)
    add(2,0,-pvs[0].z)

    // debug_print(pvs, uvs)
    
    const textureU = new Vector(uvs[0].x,uvs[1].x,uvs[2].x)
    const textureV = new Vector(uvs[0].y,uvs[1].y,uvs[2].y)

    return { origin, textureU, textureV, panU: 0, panV: 0 }
    
    function swap(i: number, j: number){
        const uj = uvs[j]
        uvs[j] = uvs[i]
        uvs[i] = uj
        const pj = pvs[j]
        pvs[j] = pvs[i]
        pvs[i] = pj
    }
    
    function add(i: number, j: number, s: number){
        pvs[j] = pvs[j].add_vector(pvs[i].scale(s))
        uvs[j] = uvs[j].add_vector(uvs[i].scale(s))
    }

    function divide(i: number, s: number){
        pvs[i] = pvs[i].divide_by_scalar(s)
        uvs[i] = uvs[i].divide_by_scalar(s)
    }

    // function debug_print(pvs: Vector[], uvs: Vector[]){
    //     console.table(pvs.map((v,i) => ({ px: v.x, py:v.y, pz:v.z, ux:uvs[i].x, uy:uvs[i].y, uz:uvs[i].z })))
    // }
}

export function impl_v2(vertexes: Vector[], uvs: Vector[]): BrushPolygonUvData {
    EditorError.if(vertexes.length != uvs.length)
    const [posA, posB, posC] = vertexes
    const [uvA, uvB, uvC] = uvs
    //console.log('polygon_uv_from_vertex_uvs', vertexes, uvs)

    let textureU = Vector.UNIT_X, textureV = Vector.UNIT_Y

    let pa = posB.subtract_vector(posA)
    let ua = uvB.subtract_vector(uvA)
    let pb = posC.subtract_vector(posB)
    let ub = uvC.subtract_vector(uvB)
    let pc = posA.subtract_vector(posC)
    let uc = uvA.subtract_vector(uvC)

    //printTable(pa, ua, pb, ub, pc, uc)

    if (pa.x === 0) {
        if (pb.x !== 0) {
            [pa, pb, ua, ub] = [pb, pa, ub, ua]
        } else if (pc.x !== 0) {
            [pa, pc, ua, uc] = [pc, pa, uc, ua]
        }
    }

    if (pb.y === 0){
        if (pc.y !== 0){
            [pb, pc, ub, uc] = [pc, pb, uc, ub]
        }
    }

    if (pa.x !== 0) {
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
    }

    if (pb.y !== 0) {
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
    }

    if (pc.z !== 0) {

        {
            const s = pb.z / pc.z
            pb = pb.subtract_vector(pc.scale(s))
            ub = ub.subtract_vector(uc.scale(s))
        }

        {
            const s = pa.z / pc.z
            pa = pa.subtract_vector(pc.scale(s))
            ua = ua.subtract_vector(uc.scale(s))
        }

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

    //printTable(pa, ua, pb, ub, pc, uc)

    textureU = new Vector(ua.x, ub.x, uc.x)
    textureV = new Vector(ua.y, ub.y, uc.y)

    // origin should be the world position where UV is ZERO
    const v1 = impl_v1(vertexes, uvs);

    // this algorithm applies panning by moving the origin
    // so there is no need for these additional pans
    const panU = 0, panV = 0

    const result: BrushPolygonUvData = { origin: v1.origin, panU, panV, textureU, textureV }

    // but in some degenerate cases we might need to adjust
    const uv = get_vertex_uv(result, posA)
    result.panU = uvA.x - uv.x
    result.panV = uvA.y - uv.y

    return result;
}

function impl_v1(vertexes: Vector[], uvs: Vector[]) {
    EditorError.if(vertexes.length != uvs.length)
    const [posA, posB, posC] = vertexes
    const [uvA, uvB, uvC] = uvs

    let textureU: Vector, textureV: Vector

    // console.log(vertexes);

    // find polygon UV vectors textureU and textureV
    {
        let dpAB = posB.subtract_vector(posA)
        let dpAC = posC.subtract_vector(posA)
        let duAB = uvB.subtract_vector(uvA)
        let duAC = uvC.subtract_vector(uvA)

        // debug_print()

        if (duAB.x === 0 && duAC.x !== 0) {
            [dpAB, dpAC, duAB, duAC] = [dpAC, dpAB, duAC, duAB]
        }

        // debug_print()

        if (duAC.x !== 0) {
            EditorError.if(duAB.x === 0, 'polygon has degenerate vertex UV')
            const reduct01 = duAC.x / duAB.x
            dpAC = dpAC.subtract_vector(dpAB.scale(reduct01))
            duAC = duAC.subtract_vector(duAB.scale(reduct01))
        }
        
        // debug_print()

        if (duAB.y !== 0) {
            EditorError.if(duAC.y === 0, 'polygon has degenerate vertex UV')
            const reduct10 = duAB.y / duAC.y
            dpAB = dpAB.subtract_vector(dpAC.scale(reduct10))
            duAB = duAB.subtract_vector(duAC.scale(reduct10))
        }
        
        // debug_print()

        if (duAB.x !== 1) {
            const scaleAB = 1 / duAB.x
            dpAB = dpAB.scale(scaleAB)
            duAB = duAB.scale(scaleAB)
        }

        // debug_print()

        if (duAC.y !== 1) {
            const scaleAC = 1 / duAC.y
            dpAC = dpAC.scale(scaleAC)
            duAC = duAC.scale(scaleAC)
        }
        textureU = dpAB
        textureV = dpAC

        // debug_print()

        // function debug_print(){
        //     console.table([
        //         [dpAB.x, dpAB.y, dpAB.z, duAB.x, duAB.y, duAB.z].map(format),
        //         [dpAC.x, dpAC.y, dpAC.z, duAC.x, duAC.y, duAC.z].map(format)
        //     ])
        // }
        
        // function format(n: number) {
        //     return Number(n.toPrecision(4))
        // }
    }

    // origin should be the world position where UV is ZERO
    const origin = posA
        .subtract_vector(textureU.scale(uvA.x))
        .subtract_vector(textureV.scale(uvA.y))

    return {origin, textureU, textureV}

}

function printTable(pa: Vector, ua: Vector, pb: Vector, ub: Vector, pc: Vector, uc: Vector) {
    console.table([
        [pa.x, pa.y, pa.z, ua.x, ua.y],
        [pb.x, pb.y, pb.z, ub.x, ub.y],
        [pc.x, pc.y, pc.z, uc.x, uc.y]
    ])
}