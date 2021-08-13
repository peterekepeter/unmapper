import { BrushPolygon } from "../BrushPolygon"
import { BrushVertex } from "../BrushVertex"
import { Vector } from "../Vector"


export function calculate_polygon_median(brush_vertexex: BrushVertex[], poly: BrushPolygon): Vector {
    if (poly.vertexes.length < 3){
        throw new Error("cannot calcualte median for invalid polygon")
    }
    let x=0, y=0, z=0
    for (const vid of poly.vertexes){
        const vert = brush_vertexex[vid]
        x+=vert.position.x
        y+=vert.position.y
        z+=vert.position.z
    }
    const weigth = 1/poly.vertexes.length
    x*=weigth
    y*=weigth
    z*=weigth
    return new Vector(x,y,z)
}