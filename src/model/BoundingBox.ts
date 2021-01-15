import { Vector } from "./Vector"


export class BoundingBox {
    
    min_x: number
    min_y: number
    min_z: number
    max_x: number
    max_y: number
    max_z: number
    
    static INFINITE_BOX = BoundingBox.from_vectors(Vector.NEGATIVE_INFINITY, Vector.INFINITY);
    static UNIT_BOX = BoundingBox.from_vectors(Vector.NEGATIVE_ONES, Vector.ONES);
    static ZERO_BOX = BoundingBox.from_vectors(Vector.ZERO, Vector.ZERO);

    constructor(bounds?: {
        min_x?: number,
        min_y?: number,
        min_z?: number,
        max_x?: number,
        max_y?: number,
        max_z?: number
    }) {
        if (!bounds){
            return BoundingBox.INFINITE_BOX;
        }
        this.min_x = bounds.min_x ?? -Infinity;
        this.min_y = bounds.min_y ?? -Infinity;
        this.min_z = bounds.min_z ?? -Infinity;
        this.max_x = bounds.max_x ?? +Infinity;
        this.max_y = bounds.max_y ?? +Infinity;
        this.max_z = bounds.max_z ?? +Infinity;
    }

    static from_vectors(...vectors: Vector[]): BoundingBox {
        return BoundingBox.from_vectors_list(vectors);
    }

    static from_vectors_list(vectors: Vector[]): BoundingBox {
        if (vectors.length === 0){
            return BoundingBox.INFINITE_BOX;
        }
        const first = vectors[0];

        let min_x = first.x, min_y = first.y, min_z = first.z;
        let max_x = first.x, max_y = first.y, max_z = first.z;

        for (let i=1; i<vectors.length; i++){
            const vector = vectors[i];
            min_x = Math.min(min_x, vector.x);
            min_y = Math.min(min_y, vector.y);
            min_z = Math.min(min_z, vector.z);
            max_x = Math.max(max_x, vector.x);
            max_y = Math.max(max_y, vector.y);
            max_z = Math.max(max_z, vector.z);
        }

        return new BoundingBox({
            min_x, min_y, min_z,
            max_x, max_y, max_z
        });
    }
    encloses_vector(location: Vector){
        return this.encloses(location.x, location.y, location.z);
    }

    encloses(x = 0, y = 0, z = 0) {
        return (
            this.min_x <= x &&
            this.min_y <= y &&
            this.min_z <= z &&
            this.max_x >= x &&
            this.max_y >= y &&
            this.max_z >= z
        )
    }

    encloses_box(box: BoundingBox){
        return (
            this.min_x <= box.min_x &&
            this.min_y <= box.min_y &&
            this.min_z <= box.min_z &&
            this.max_x >= box.max_x &&
            this.max_y >= box.max_y &&
            this.max_z >= box.max_z
        )
    }

    intersects(box: BoundingBox){
        return (
            this.max_x >= box.min_x &&
            this.max_y >= box.min_y &&
            this.max_z >= box.min_z &&
            this.min_x <= box.max_x &&
            this.min_y <= box.max_y &&
            this.min_z <= box.max_z 
        )
    }

}