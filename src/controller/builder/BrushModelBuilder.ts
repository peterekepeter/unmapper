

export class BrushModelBuilder{

    vertex_data: number[];
    
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