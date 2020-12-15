import { BrushEdge } from "./BrushEdge";
import { BrushPolygon } from "./BrushPolygon";
import { BrushVertex } from "./BrushVertex";
import { Vector } from "./Vector";


export class BrushModel
{
    name : string = '';
    polygons : BrushPolygon[] = [];
    edges: BrushEdge[] = [];
    vertexes: BrushVertex[] = [];

    shallowCopy(){
        const copy = new BrushModel();
        Object.assign(copy, this);
        return copy;
    }

    /** returns vertex index, or -1 if not found*/
    findVertexIndex(position: Vector): number {
        return this.vertexes.findIndex(v => v.position.equals(position));
    }

    /** returns new vertex index */
    addVertex(position: Vector, selected: boolean = false): number {
        const newVertex = new BrushVertex(position);
        newVertex.selected = selected;
        const index = this.vertexes.length;
        this.vertexes.push(newVertex);
        return index;
    }

    /** returns vertex index */
    findVertexIndexOrAddVertex(position: Vector) : number {
        const vid = this.findVertexIndex(position);
        if (vid < 0){
            return this.addVertex(position);
        }
        return vid;
    }

    findEdgeIndex(edgeVertexA: number, edgeVertexB: number) {
        return this.edges.findIndex(e => e.hasVertexes(edgeVertexA, edgeVertexB));
    }

    findPolygonsContaining(query: { vertexes: number[], min_vertex_match: number }) : BrushPolygon[]{
        const result : BrushPolygon[] = [];
        for (const poly of this.polygons){
            let vertex_match_count = 0;
            for (const vertex of poly.vertexes){
                if (query.vertexes.indexOf(vertex) !== -1){
                    vertex_match_count++;
                }
            }
            if (vertex_match_count >= query.min_vertex_match){
                result.push(poly);
            }
        }
        return result;
    }

    addEdge(edgeVertexA: number, edgeVertexB: number)
    {
        const newEdge = new BrushEdge();
        newEdge.vertexIndexA = edgeVertexA;
        newEdge.vertexIndexB = edgeVertexB;
        const index = this.edges.length;
        this.edges.push(newEdge);
        return index;
    }

    findEdgeIndexOrAddEdge(edgeVertexA: number, edgeVertexB: number) : number {
        const index = this.findEdgeIndex(edgeVertexA, edgeVertexB);
        if (index < 0){
            return this.addEdge(edgeVertexA, edgeVertexB);
        }
        return index;
    }

    buildAllPolygonEdges(){
        this._removeAllPolygonEdges();
        for (let i=0; i<this.polygons.length; i++){
            addPolygonEdges(this, i);
        }
    }

    buildPolygonEdges(polygonIndex: number){
        this._removePolygonEdges(polygonIndex);
        addPolygonEdges(this, polygonIndex);
    }

    calculatePolygonMedian(pid: number) {
        const poly = this.polygons[pid];
        if (poly.vertexes.length < 3){
            poly.median = null;
            // invalid poly
            return;
        }
        let x=0, y=0, z=0;
        for (const vid of poly.vertexes){
            const vert = this.vertexes[vid];
            x+=vert.position.x;
            y+=vert.position.y;
            z+=vert.position.z;
        }
        const weigth = 1/poly.vertexes.length;
        x*=weigth;
        y*=weigth;
        z*=weigth;
        if (poly.median == null 
            || poly.median.x !== x 
            || poly.median.y !== y
            || poly.median.z !== z){
            poly.median = new Vector(x,y,z);
        }
    }

    calculateAllPolygonMedian(){
        for (let i=0; i<this.polygons.length; i++){
            this.calculatePolygonMedian(i);
        }
    }

    calculatePolygonNormal(pid: number){
        
    }

    getSelectedVertexIndices(): number[] {
        const result = [];
        for (let i=0; i<this.vertexes.length; i++){
            if (this.vertexes[i].selected){
                result.push(i);
            }
        }
        return result;
    }

    getSelectedPolygonIndices(): number[] {
        const result = [];
        for (let i=0; i<this.polygons.length; i++){
            const polygon = this.polygons[i];
            let selected = true;
            for (let j=0; j<polygon.vertexes.length; j++){
                const vertex = this.vertexes[polygon.vertexes[j]];
                if (!vertex.selected){
                    selected = false;
                    break;
                }
            }
            if (selected){
                result.push(i);
            }
        }
        return result;
    }

    private _removeAllPolygonEdges(){
        for (const edge of this.edges){
            if (edge.polygons.length != 0){
                edge.polygons = [];
            }
        }
        for (const poly of this.polygons){
            if (poly.edges.length != 0){
                poly.edges = [];
            }
        }
    }

    private _removePolygonEdges(polygonIndex: number){
        const poly = this.polygons[polygonIndex];
        poly.edges = [];
        for (const edge of this.edges){
            const edgePolyIndex = edge.polygons.indexOf(polygonIndex);
            if (edgePolyIndex !== -1){
                edge.polygons = edge.polygons.filter((_, index) => index !== edgePolyIndex);
            }
        }
    }
}

function addPolygonEdges(brush : BrushModel, polygonIndex : number){

    const poly = brush.polygons[polygonIndex];

    if (poly.vertexes.length < 3){
        // invalid polygon
        return;
    }

    for (let i=1; i<poly.vertexes.length; i++){
        const edgeVertexA = poly.vertexes[i-1];
        const edgeVertexB = poly.vertexes[i];
        addPolyEdge(brush, edgeVertexA, edgeVertexB, poly, polygonIndex);
    }
    const lastVertex = poly.vertexes[poly.vertexes.length-1];
    const firstVertex = poly.vertexes[0];
    addPolyEdge(brush, lastVertex, firstVertex, poly, polygonIndex);
}

function addPolyEdge(brush : BrushModel, edgeVertexA: number, edgeVertexB:number, poly:BrushPolygon, polygonIndex : number){
    let edgeIndex = brush.findEdgeIndexOrAddEdge(edgeVertexA, edgeVertexB);
    poly.edges.push(edgeIndex);
    brush.edges[edgeIndex].polygons.push(polygonIndex); // single edge might actually be used by multiple polys
}