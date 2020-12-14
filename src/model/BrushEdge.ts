export class BrushEdge
{
    vertexIndexA : number;
    vertexIndexB : number;
    polygons: number[] = [];
    static MISSING_VERTEX: -1;

    constructor(
        vertexIndexA : number = BrushEdge.MISSING_VERTEX, 
        vertexIndexB : number = BrushEdge.MISSING_VERTEX)
    {
        this.vertexIndexA = vertexIndexA;
        this.vertexIndexB = vertexIndexB;
    }

    addPolygon(polygonIndex: number) {
        if (this.polygons.indexOf(polygonIndex) === -1){
            this.polygons.push(polygonIndex);
        }
    }
    
    hasVertexes(edgeVertexA: number, edgeVertexB: number): boolean {
        return this.vertexIndexA === edgeVertexA && this.vertexIndexB === edgeVertexB 
            || this.vertexIndexA === edgeVertexB && this.vertexIndexB === edgeVertexA; 
    }

    shallowCopy() {
        const copy = new BrushEdge();
        Object.assign(copy, this);
        return copy;
    }

    static fromArrayToList(data: number[], index = 0, count = -1) : BrushEdge[] {
        if (count === -1){
            count = Math.floor(data.length/2);
        }
        const result : BrushEdge[] = [];
        for (let i=0; i<count; i++){
            result.push(new BrushEdge(data[index], data[index+1]));
            index+=2;
        }
        return result;
    }
}