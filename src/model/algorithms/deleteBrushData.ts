import { BrushModel } from "../BrushModel";

interface ISelectedBrushData
{
    vertexes?: number[];
    polygons?: number[];
    edges?: number[];
}

export function deleteBrushData(brush: BrushModel, selection: ISelectedBrushData) : BrushModel{
    const vertexesToDelete = selection.vertexes || [];
    const edgesToDelete : number[] = selection.edges ? [...selection.edges] : []; 
    for (let i=0; i<brush.edges.length; i++){
        const edge=brush.edges[i];
        if (vertexesToDelete.indexOf(edge.vertexIndexA) !== -1 
         || vertexesToDelete.indexOf(edge.vertexIndexB) !== -1){
            edgesToDelete.push(i);
        }
    }
    const polygonsToDelete : number[] = selection.polygons ? [...selection.polygons] : [];
    for (let i=0; i<brush.polygons.length; i++){
        const poly = brush.polygons[i];
        let toDelete = false;
        for (const polyVertex of poly.vertexes)
        {
            if (vertexesToDelete.indexOf(polyVertex) !== -1){
                toDelete = true;
                break;
            }
        }
        if (toDelete){
            polygonsToDelete.push(i);
            continue;
        }
        for (const polyEdge of poly.edges)
        {
            if (edgesToDelete.indexOf(polyEdge) !== -1){
                toDelete = true;
                break;
            }
        }
        if (toDelete){
            polygonsToDelete.push(i);
        }
    }
    return executeDeleteOp(brush, polygonsToDelete, edgesToDelete, vertexesToDelete);
}

function executeDeleteOp(
    input: BrushModel, 
    polygonsToDelete: number[], 
    edgesToDelete: number[], 
    vertexesToDelete: number[]
) : BrushModel {
    // remove objects
    const brush = input.shallowCopy();
    brush.polygons = brush.polygons.filter((p,i) => polygonsToDelete.indexOf(i) === -1);
    brush.edges = brush.edges.filter((p,i) => edgesToDelete.indexOf(i) === -1);
    brush.vertexes = brush.vertexes.filter((p,i) => vertexesToDelete.indexOf(i) === -1);
    // update indexes of polys
    for (let i=0; i<brush.polygons.length; i++){
        const currentPoly = brush.polygons[i];
        let needUpdateVertexList = false;
        for (const toDeleteIndex in vertexesToDelete){
            for (const polyVertIndex in currentPoly.vertexes){
                if (toDeleteIndex < polyVertIndex){
                    needUpdateVertexList = true;
                    break;
                }
            }
            if (needUpdateVertexList){
                break;
            }
        }
        let needUpdateEdgeList = false;
        for (const toDeleteEdge in edgesToDelete){
            for (const polyEdgeIndex in currentPoly.edges){
                if (toDeleteEdge < polyEdgeIndex){
                    needUpdateEdgeList = true;
                    break;
                }
            }
            if (needUpdateEdgeList){
                break;
            }
        }
        if (!needUpdateEdgeList && !needUpdateVertexList){
            continue;
        }
        const poly = currentPoly.shallowCopy();
        brush.polygons[i] = poly; // brush is a fresh copy, can edit it in place
        if (needUpdateVertexList){
            poly.vertexes = poly.vertexes.map(v => {
                let newIndex = v;
                for (const toDeleteIndex of vertexesToDelete){
                    if (toDeleteIndex < v) {
                        newIndex--;
                    }
                }
                return newIndex;
            });
        }
        if (needUpdateEdgeList){
            poly.edges = poly.edges.map(e => {
                let newIndex = e;
                for (const toDeleteIndex of edgesToDelete){
                    if (toDeleteIndex < e){
                        newIndex--;
                    }
                }
                return newIndex;
            })
        }
    }
    // update indexes of edges
    for (let i=0; i<brush.edges.length; i++){
        const currentEdge = brush.edges[i];
        let needVertexUpdate = false;
        for (const vertexToDeleteIndex of vertexesToDelete) {
            if (vertexToDeleteIndex < currentEdge.vertexIndexA || 
                vertexToDeleteIndex < currentEdge.vertexIndexB) 
            {
                needVertexUpdate = true; 
                break;
            }
        }
        let needUpdatePolys = false;
        for (const edgePoly of currentEdge.polygons){
            for (const toDeleteIndex of polygonsToDelete){
                if (toDeleteIndex <= edgePoly){
                    needUpdatePolys = true;
                    break;
                }
            }
            if (needUpdatePolys){
                break;
            }
        }
        if (!needVertexUpdate && !needUpdatePolys){
            continue;
        }
        const edge = currentEdge.shallow_copy();
        brush.edges[i] = edge; // brush is a fesh copy, can edit it in place
        if (needVertexUpdate) {
            for (const toDeleteIndex of vertexesToDelete)
            {
                if (toDeleteIndex < currentEdge.vertexIndexA) {
                    edge.vertexIndexA--;
                }
                if (toDeleteIndex < currentEdge.vertexIndexB) {
                    edge.vertexIndexB--;
                }
            }
        }
        if (needUpdatePolys) {
            edge.polygons = edge.polygons
                .filter(p => polygonsToDelete.indexOf(p) === -1)
                .map((p) => {
                let newIndex = p;
                for (const toDeleteIndex of polygonsToDelete){
                    if (toDeleteIndex < p){
                        newIndex--;
                    }
                }
                return newIndex;
            })
        }
    }
    return brush; // don't forget to return the new brush
}