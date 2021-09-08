import { BrushPolygon } from "../BrushPolygon"
import { BrushVertex } from "../BrushVertex"
import { Vector } from "../Vector"

export function calculate_polygon_center(vertex_data: BrushVertex[], polygon: BrushPolygon): Vector {
    if (polygon.vertexes.length < 3){
        throw new Error("cannot calculate median for invalid polygon")
    }
    const vertex_iterator = enumerate_poly_vertexes(vertex_data, polygon)
    return calculate_polygon_center_from_iterable(vertex_iterator)
}

export function calculate_polygon_center_from_iterable(it: Iterable<BrushVertex>): Vector {
    let x = 0, y = 0, z = 0, count = 0
    for (const vertex of it){
        x += vertex.position.x
        y += vertex.position.y
        z += vertex.position.z
        count += 1
    }
    x /= count
    y /= count
    z /= count
    return new Vector(x, y, z)
}

function* enumerate_poly_vertexes(brush_vertexes: BrushVertex[], poly: BrushPolygon): Iterable<BrushVertex>{
    for (const index of poly.vertexes){
        const vertex = brush_vertexes[index]
        yield vertex
    }
}

/** @deprecated use calculate_polygon_center instead */
export function calculate_polygon_median(brush_vertexes: BrushVertex[], poly: BrushPolygon): Vector {
    return calculate_polygon_center(brush_vertexes, poly)
}
