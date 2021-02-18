import { BrushModel } from "../BrushModel";
import { BrushPolygon } from "../BrushPolygon";


export function triangulate_brush(brush: BrushModel) : BrushModel
{
    if (brush.polygons.length == 0){
        // trivial case, empty list
        return brush;
    }
    if (brush.polygons.findIndex(p => p.vertexes.length != 3) === -1){
        // trivial case, already triangulated
        return brush;
    }
    const result : BrushPolygon[] = [];
    for (const poly of brush.polygons){
        if (poly.vertexes.length <= 3){
            // this poly is already triangulated
            result.push(poly);
        }
        else {
            const vertex_a = poly.vertexes[0];
            for (let i=2; i<poly.vertexes.length; i++){
                // triangulate !
                const triangle = poly.shallowCopy();
                const vertex_b = poly.vertexes[i-1];
                const vertex_c = poly.vertexes[i];
                triangle.vertexes = [vertex_a, vertex_b, vertex_c];
                result.push(triangle);
            }
        }
    }
    const triangulated = brush.shallowCopy();
    triangulated.polygons = result;
    triangulated.edges = triangulated.edges.map(e => e.shallow_copy());
    triangulated.rebuild_all_poly_edges();
    return triangulated;
}