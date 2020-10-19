export class BrushEdge
{
    vertexIndexA : number = -1;
    vertexIndexB : number = -1;
    polygons: number[] = [];
    static MISSING_VERTEX: -1;

    addPolygon(polygonIndex: number) {
        if (this.polygons.indexOf(polygonIndex) === -1){
            this.polygons.push(polygonIndex);
        }
    }
    
    hasVertexes(edgeVertexA: number, edgeVertexB: number): boolean {
        return this.vertexIndexA === edgeVertexA && this.vertexIndexB === edgeVertexB 
            || this.vertexIndexA === edgeVertexB && this.vertexIndexB === edgeVertexA; 
    }
}