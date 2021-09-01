import { BrushPolygon } from "../BrushPolygon"
import { BrushVertex } from "../BrushVertex"
import { calculate_polygon_median } from "./calculate_polygon_median"
import { calculate_polygon_normal } from "./calculate_polygon_normal"

export function update_polygon_median_normal(vertexes: BrushVertex[], polygon: BrushPolygon): BrushPolygon{
    const center_point = calculate_polygon_median(vertexes, polygon)
    const normal = calculate_polygon_normal(vertexes, polygon)
    if (!center_point.equals(polygon.median) || !normal.equals(polygon.normal)){
        polygon = polygon.shallow_copy()
        polygon.median = center_point
        polygon.normal = normal
    }
    return polygon
}
