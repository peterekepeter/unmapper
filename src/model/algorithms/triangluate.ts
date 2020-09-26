import { Polygon } from "../Polygon";


export function triangulate(polygons: Polygon[]) : Polygon[]
{
    if (polygons.length == 0){
        // trivial case, empty list
        return polygons;
    }
    if (polygons.findIndex(p => p.vertexes.length != 3) === -1){
        // trivial case, already triangulated
        return polygons;
    }
    const result = [];
    for (const poly of polygons){
        if (poly.vertexes.length < 4){
            // this poly is already triangulated
            result.push(poly);
        }
        const vertexA = poly.vertexes[0];
        for (let i=2; i<poly.vertexes.length; i++){
            // triangulate !
            const triangle : Polygon = {...poly};
            const vertexB = poly.vertexes[i-1];
            const vertexC = poly.vertexes[i];
            triangle.vertexes = [vertexA, vertexB, vertexC];
            result.push(triangle);
        }
    }
    return result;
}