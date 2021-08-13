import { BrushEdge } from "./BrushEdge"
import { BrushModel } from "./BrushModel"
import { BrushPolygon } from "./BrushPolygon"
import { BrushVertex } from "./BrushVertex"
import { EditorError } from "./error/EditorError"
import { Vector } from "./Vector"
import { deep_freeze } from "../util/deep_freeze"


export class BrushModelBuilder{

    private _name = "BrushModel"
    private _vertexes: BrushVertex[] = []
    private _polygons: BrushPolygon[] = []
    private _edges: BrushEdge[] = []

    build(): BrushModel {
        const model = new BrushModel()
        model.polygons = this._polygons
        model.vertexes = this._vertexes
        model.edges = this._edges
        model.name = this._name
        model.rebuild_all_poly_edges()
        deep_freeze(model)
        return model
    }

    set_name(name: string): void{
        this._name = name
    }

    add_vertex_coords(x: number, y:number, z: number): void
    {
        this._vertexes.push(BrushVertex.from_coords(x,y,z))
    }
    
    add_vertex(vertex: BrushVertex): void
    {
        this._vertexes.push(vertex)
    }

    add_vertex_vector(position: Vector): void
    {
        this._vertexes.push(BrushVertex.from_vector(position))
    }
    
    get next_vertex_index(): number {
        return this._vertexes.length
    }
    
    add_edge(vertex_a: number, vertex_b: number): void {
        this._edges.push(new BrushEdge(vertex_a, vertex_b))
    }

    add_triangle(vertex_a: number, vertex_b: number, vertex_c: number):void {
        this.add_polygon(vertex_a, vertex_b, vertex_c)
    }

    add_quads(vertex: number[]): void {
        if (vertex.length % 4 !== 0){
            throw new EditorError("vertex count should be multiple of 4")
        }
        for (let i=0; i<vertex.length; i+= 4){
            this.add_quad(vertex[i], vertex[i+1], vertex[i+2], vertex[i+3])
        }
    }

    add_quad(vertex_a: number, vertex_b: number, vertex_c: number, vertex_d: number):void {
        this.add_polygon(vertex_a, vertex_b, vertex_c, vertex_d)
    }

    add_polygon(...vertexes: number[]): void {
        const poly = new BrushPolygon()
        const a = this._vertexes[vertexes[0]].position
        const b = this._vertexes[vertexes[1]].position
        const c = this._vertexes[vertexes[2]].position
        const u = a.vector_to_vector(b).normalize()
        const n = u.cross(a.vector_to_vector(c)).normalize()
        const v = u.cross(n)
        let mx = 0, my = 0, mz = 0
        for (const idx of vertexes){
            mx += this._vertexes[idx].position.x
            my += this._vertexes[idx].position.y
            mz += this._vertexes[idx].position.z
        }
        mx /= vertexes.length
        my /= vertexes.length
        mz /= vertexes.length
        poly.vertexes = vertexes
        poly.origin = a
        poly.median = new Vector(mx, my, mz)
        poly.textureU = u
        poly.textureV = v
        poly.normal = n
        this._polygons.push(poly)
    }
}