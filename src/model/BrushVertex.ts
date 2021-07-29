import { Vector } from "./Vector"


export class BrushVertex {
    position: Vector
    selected = false;

    constructor(position: Vector, selected = false) {
        this.position = position
        this.selected = selected
    }

    shallow_copy(): BrushVertex {
        const vertex = new BrushVertex(this.position)
        Object.assign(vertex, this)
        return vertex
    }

    static from_vector(v: Vector, selected?: boolean): BrushVertex {
        return new BrushVertex(v, selected)
    }

    static from_coords(x = 0, y = 0, z = 0, selected?: boolean): BrushVertex {
        return this.from_vector(new Vector(x, y, z), selected)
    }

    static from_array(data:number[], index = 0): BrushVertex {
        return this.from_vector(Vector.from_array(data, index))
    }

    static from_array_to_list(data:number[], index=0, vertexCount=-1): BrushVertex[] {
        if (vertexCount == -1){
            vertexCount = Math.floor(data.length/3)
        }
        const result: BrushVertex[] = []
        for (let i=0; i<vertexCount; i++){
            result.push(BrushVertex.from_array(data, index))
            index += 3
        }
        return result
    }

    /** @deprecated */
    static fromArrayToList(data:number[], index=0, vertex_count=-1): BrushVertex[] {
        return this.from_array_to_list(data, index, vertex_count)
    }

    /** @deprecated */
    shallowCopy(): BrushVertex {
        return this.shallow_copy()
    }
}