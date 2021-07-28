import { BrushVertex } from "../../model/BrushVertex"
import { EditorError } from "../../model/error/EditorError";
import { Vector } from "../../model/Vector"


export class BrushModelBuilder{

    vertex_data: BrushVertex[];

    add_vertex(x: number, y:number, z: number, selected?: boolean) : void
    add_vertex(vertex: BrushVertex): void
    add_vertex(position: Vector, selected?: boolean): void
    add_vertex(a: Vector|BrushVertex | number, b?: boolean | number, c?: number, d?: boolean): void
    {
        if (a instanceof BrushVertex){
            this.vertex_data.push(a)
        }
        else if (a instanceof Vector && (typeof b === 'boolean' || typeof b === "undefined"))
        {
            this.vertex_data.push(BrushVertex.from_vector(a, b))
        }
        else if (typeof a === 'number' && typeof b === "number" && typeof c === "number" && (typeof b === "boolean" || typeof b === "undefined"))
        {
            this.vertex_data.push(BrushVertex.from_coords(a,b,c,d))
        }
        else {
            throw new EditorError("invalid argument")
        }
    }

    get next_vertex_index(): number {
        return this.vertex_data.length
    }
    
    // polygon
    
    // add_polygon(...vertexes: number[]){
    //     const poly = new BrushPolygon()
    //     const a = this.vertexes[vertexes[0]].position
    //     const b = this.vertexes[vertexes[1]].position
    //     const c = this.vertexes[vertexes[2]].position
    //     const u = a.vector_to_vector(b).normalize()
    //     const n = u.cross(a.vector_to_vector(c)).normalize()
    //     const v = u.cross(n)
    //     let mx = 0, my = 0, mz = 0
    //     for (const idx of vertexes){
    //         mx += this.vertexes[idx].position.x
    //         my += this.vertexes[idx].position.x
    //         mz += this.vertexes[idx].position.x
    //     }
    //     mx /= vertexes.length
    //     my /= vertexes.length
    //     mz /= vertexes.length
    //     poly.vertexes = vertexes
    //     poly.origin = a
    //     poly.median = new Vector(mx, my, mz)
    //     poly.textureU = u
    //     poly.textureV = v
    //     poly.normal = n
    //     this.polygons.push(poly)
    // }

}