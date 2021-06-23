import { BrushModel } from "../BrushModel"
import { BrushPolygon } from "../BrushPolygon"
import { polygon_uv_from_vertex_uvs } from "../uvmap/vertex_uv"
import { Vector } from "../Vector"

export function uv_triplanar_map(input_brush: BrushModel): BrushModel {
    const new_brush = input_brush.shallow_copy()

    new_brush.polygons = new_brush.polygons.map(input_poly => {
        const new_poly = input_poly.shallow_copy()

        const vertexes = input_poly.vertexes.map(n => new_brush.vertexes[n].position)
        let uvs : Vector[]

        switch (get_best_axis(input_poly)) {
            case 0: uvs = vertexes.map(v => new Vector(v.y, v.z, 0)); break
            case 1: uvs = vertexes.map(v => new Vector(v.x, v.z, 0)); break
            case 2: uvs = vertexes.map(v => new Vector(v.x, v.y, 0)); break
        }

        const result = polygon_uv_from_vertex_uvs(vertexes, uvs)
        new_poly.origin = result.origin
        new_poly.panU = result.panU
        new_poly.panV = result.panV
        new_poly.textureU = result.textureU
        new_poly.textureV = result.textureV
        
        return new_poly
    })

    return new_brush
}

function get_best_axis(input_poly: BrushPolygon): 0 | 1 | 2 {
    
    const abs_x = Math.abs(input_poly.normal.x)
    const abs_y = Math.abs(input_poly.normal.y)
    const abs_z = Math.abs(input_poly.normal.z)
    let best_axis: 0 | 1 | 2 = 0
    let best_length = abs_x
    if (abs_y > best_length) {
        best_axis = 1
        best_length = abs_y
    }
    if (abs_z >= best_length) {
        best_axis = 2
        best_length = abs_z
    }
    return best_axis

}