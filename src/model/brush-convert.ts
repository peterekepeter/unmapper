import { BrushModel } from "./BrushModel";
import { BrushPolygon } from "./BrushPolygon";
import { BrushPolygonData } from "./BrushPolygonData";


export function brushToPolygonData(brush : BrushModel) : BrushPolygonData[] {
    const data : BrushPolygonData[] = [];
    for (const poly of brush.polygons){
        const item = new BrushPolygonData();

        item.flags = poly.flags;
        item.item = poly.item;
        item.link = poly.link;
        item.normal = poly.normal;
        item.origin = poly.origin;
        item.panU = poly.panU;
        item.panV = poly.panV;
        item.texture = poly.texture;
        item.textureU = poly.textureU;
        item.textureV = poly.textureV;

        item.vertexes = [];
        for (const vertIndex of poly.vertexes){
            item.vertexes.push(brush.vertexes[vertIndex].position);
        }
        data.push(item);
    }
    return data;
}

export function polygonDataToBrush(data : BrushPolygonData[]) : BrushModel {
    const brush = new BrushModel;
    for (const item of data){
        const poly = new BrushPolygon;
        const pid = brush.polygons.length;

        poly.flags = item.flags;
        poly.item = item.item;
        poly.link = item.link;
        poly.normal = item.normal;
        poly.origin = item.origin;
        poly.panU = item.panU;
        poly.panV = item.panV;
        poly.texture = item.texture;
        poly.textureU = item.textureU;
        poly.textureV = item.textureV;

        poly.vertexes = [];
        poly.edges = [];

        for (const position of item.vertexes){
            const vi = brush.findVertexIndexOrAddVertex(position);
            poly.addVertexIndex(vi);
        }

        brush.polygons.push(poly);
    }
    brush.calculateAllPolygonMedian();
    brush.buildAllPolygonEdges();
    return brush;
}

