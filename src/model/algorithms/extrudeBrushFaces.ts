import { BrushModel } from "../BrushModel";
import { BrushPolygon } from "../BrushPolygon";
import { BrushVertex } from "../BrushVertex";



export function extrudeBrushFaces(brush: BrushModel, facesIndices: number[], distance: number) : BrushModel {
    if (facesIndices.length == 0 || distance === 0) {
        return brush;
    }
    const mutableBrush = brush.shallowCopy();
    mutableBrush.vertexes = mutableBrush.vertexes.slice();
    mutableBrush.polygons = mutableBrush.polygons.slice();
    for (const faceIndex of facesIndices){
        extrudeFace(faceIndex, distance, mutableBrush);
    }
    mutableBrush.buildAllPolygonEdges()
    return mutableBrush;
}

/** !mutates vertexes and polygons */
function extrudeFace(faceIndex: number, distance: number, brush: BrushModel){
    const face = brush.polygons[faceIndex];
    const normal = face.normal;
    const extrudeVector = normal.scale(distance);
    const replacementFace = face.shallowCopy();
    replacementFace.vertexes = [];
    // add new vertexes
    for (const vertexIndex of face.vertexes){
        const vertex = brush.vertexes[vertexIndex];
        const newVertexIndex = brush.addVertex(vertex.position.addVector(extrudeVector));
        replacementFace.vertexes.push(newVertexIndex);
    }
    brush.polygons[faceIndex] = replacementFace;
}
