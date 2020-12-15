import { BrushModel } from "../BrushModel";
import { Vector } from "../Vector";

export function extrudeBrushFaces(brush: BrushModel, facesIndices: number[], distance: number) : BrushModel {
    if (facesIndices.length == 0 || distance === 0) {
        return brush;
    }
    const new_brush = brush.shallowCopy();
    new_brush.vertexes = new_brush.vertexes.slice();
    new_brush.polygons = new_brush.polygons.slice();
    for (const faceIndex of facesIndices){
        extrudeFaceDistance(new_brush, faceIndex, distance);
    }
    new_brush.buildAllPolygonEdges()
    return new_brush;
}

function extrudeFaceDistance(mutable_brush: BrushModel, face_index: number, extrude_distance: number) : void {
    const targetFace = mutable_brush.polygons[face_index];
    const normal = targetFace.normal;
    const extrude_vector = normal.scale(extrude_distance);
    extrudeFaceVector(mutable_brush, face_index, extrude_vector);
}

function extrudeFaceVector(mutable_brush: BrushModel, face_index: number, extrude_vector: Vector) : void {
    const targetFace = mutable_brush.polygons[face_index];
    const replacementFace = targetFace.shallowCopy();
    replacementFace.vertexes = [];
    // add new vertexes
    for (const vertexIndex of targetFace.vertexes){
        const vertex = mutable_brush.vertexes[vertexIndex];
        const newVertexIndex = mutable_brush.addVertex(vertex.position.addVector(extrude_vector), true);
        replacementFace.vertexes.push(newVertexIndex);
    }
    // replace targetFace
    mutable_brush.polygons[face_index] = replacementFace;
    // deselect vertexes of targetFace
    for (const vertexIndex of targetFace.vertexes){
        const vertex = mutable_brush.vertexes[vertexIndex];
        if (vertex.selected){
            const new_vertex = vertex.shallowCopy();
            new_vertex.selected = false;
            mutable_brush.vertexes[vertexIndex] = new_vertex;
        }
    }
}
