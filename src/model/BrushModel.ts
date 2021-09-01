import { calculate_polygon_median } from "./algorithms/calculate_polygon_median"
import { calculate_polygon_normal } from "./algorithms/calculate_polygon_normal"
import { BrushEdge } from "./BrushEdge"
import { BrushPolygon } from "./BrushPolygon"
import { BrushVertex } from "./BrushVertex"
import { Vector } from "./Vector"

export class BrushModel
{
    name = ''
    polygons : BrushPolygon[] = []
    edges: BrushEdge[] = []
    vertexes: BrushVertex[] = []

    shallow_copy(): BrushModel {
        const copy = new BrushModel()
        Object.assign(copy, this)
        return copy
    }

    /** returns vertex index, or -1 if not found*/
    findVertexIndex(position: Vector): number {
        return this.vertexes.findIndex(v => v.position.equals(position))
    }

    /** @deprecated user add_Vertex */
    addVertex(position: Vector): number {
        const newVertex = new BrushVertex(position)
        const index = this.vertexes.length
        this.vertexes.push(newVertex)
        return index
    }

    add_vertex(x: number, y: number, z:number): void
    add_vertex(position: Vector): void 
    add_vertex(a: number|Vector, b?: number, c?:number): void {
        if (a instanceof Vector){
            this.vertexes.push(new BrushVertex(a))
        } else {
            if (typeof b !== 'number' || typeof c !== 'number'){
                throw new Error('expecting 3 numbers')
            }
            this.vertexes.push(new BrushVertex(new Vector(a, b, c)))
        }
    }

    /** returns vertex index */
    findVertexIndexOrAddVertex(position: Vector) : number {
        const vid = this.findVertexIndex(position)
        if (vid < 0){
            return this.addVertex(position)
        }
        return vid
    }

    find_edge_index(edgeVertexA: number, edgeVertexB: number): number {
        return this.edges.findIndex(e => e.hasVertexes(edgeVertexA, edgeVertexB))
    }

    findPolygonsContaining(query: { vertexes: number[], min_vertex_match: number }) : BrushPolygon[]{
        const result : BrushPolygon[] = []
        for (const poly of this.polygons){
            let vertex_match_count = 0
            for (const vertex of poly.vertexes){
                if (query.vertexes.indexOf(vertex) !== -1){
                    vertex_match_count++
                }
            }
            if (vertex_match_count >= query.min_vertex_match){
                result.push(poly)
            }
        }
        return result
    }

    add_edge(edgeVertexA: number, edgeVertexB: number): number
    {
        const newEdge = new BrushEdge()
        newEdge.vertexIndexA = edgeVertexA
        newEdge.vertexIndexB = edgeVertexB
        const index = this.edges.length
        this.edges.push(newEdge)
        return index
    }

    findEdgeIndexOrAddEdge(edgeVertexA: number, edgeVertexB: number) : number {
        const index = this.find_edge_index(edgeVertexA, edgeVertexB)
        if (index < 0){
            return this.add_edge(edgeVertexA, edgeVertexB)
        }
        return index
    }

    rebuild_all_poly_edges(): void {
        this._remove_all_poly_edges()
        for (let i=0; i<this.polygons.length; i++){
            add_polygon_edges(this, i)
        }
    }

    recalculate_median_normal(): void {
        this._remove_all_poly_edges()
        for (const polygon of this.polygons) {
            const median = calculate_polygon_median(this.vertexes, polygon)
            if (polygon.median != median){
                polygon.median = median
            }
            const normal = calculate_polygon_normal(this.vertexes, polygon)
            if (polygon.normal != normal) {
                polygon.normal = normal
            }
        }
    }

    rebuild_poly_edges(polygonIndex: number){
        this._remove_poly_edges(polygonIndex)
        add_polygon_edges(this, polygonIndex)
    }

    calculatePolygonMedian(pid: number) {
        const poly = this.polygons[pid]
        if (poly.vertexes.length < 3){
            poly.median = null
            // invalid poly
            return
        }
        let x=0, y=0, z=0
        for (const vid of poly.vertexes){
            const vert = this.vertexes[vid]
            x+=vert.position.x
            y+=vert.position.y
            z+=vert.position.z
        }
        const weigth = 1/poly.vertexes.length
        x*=weigth
        y*=weigth
        z*=weigth
        if (poly.median == null 
            || poly.median.x !== x 
            || poly.median.y !== y
            || poly.median.z !== z){
            poly.median = new Vector(x, y, z)
        }
    }

    calculateAllPolygonMedian(){
        for (let i=0; i<this.polygons.length; i++){
            this.calculatePolygonMedian(i)
        }
    }

    private _remove_all_poly_edges(){
        for (const edge of this.edges){
            if (edge.polygons.length != 0){
                edge.polygons = []
            }
        }
        for (const poly of this.polygons){
            if (poly.edges.length != 0){
                poly.edges = []
            }
        }
    }

    private _remove_poly_edges(polygonIndex: number){
        const poly = this.polygons[polygonIndex]
        poly.edges = []
        for (const edge of this.edges){
            const edgePolyIndex = edge.polygons.indexOf(polygonIndex)
            if (edgePolyIndex !== -1){
                edge.polygons = edge.polygons.filter((_, index) => index !== edgePolyIndex)
            }
        }
    }

    /** @deprecated use shallow_copy() */
    shallowCopy(): BrushModel{
        const copy = new BrushModel()
        Object.assign(copy, this)
        return copy
    }
}

function add_polygon_edges(brush : BrushModel, polygonIndex : number){

    const poly = brush.polygons[polygonIndex]

    if (poly.vertexes.length < 3){
        // invalid polygon
        return
    }

    for (let i=1; i<poly.vertexes.length; i++){
        const edgeVertexA = poly.vertexes[i-1]
        const edgeVertexB = poly.vertexes[i]
        addPolyEdge(brush, edgeVertexA, edgeVertexB, poly, polygonIndex)
    }
    const lastVertex = poly.vertexes[poly.vertexes.length-1]
    const firstVertex = poly.vertexes[0]
    addPolyEdge(brush, lastVertex, firstVertex, poly, polygonIndex)
}

function addPolyEdge(brush : BrushModel, edgeVertexA: number, edgeVertexB:number, poly:BrushPolygon, polygonIndex : number){
    const edge_index = brush.findEdgeIndexOrAddEdge(edgeVertexA, edgeVertexB)
    poly.edges.push(edge_index)
    brush.edges[edge_index].polygons.push(polygonIndex) // single edge might actually be used by multiple polys
}
