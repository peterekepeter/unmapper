import { Vector } from "./Vector"


export class BoundingBox {
    min_bounds: Vector;
    max_bounds: Vector;
    
    static INFINITE_BOX = new BoundingBox(Vector.NEGATIVE_INFINITY, Vector.INFINITY);
    static UNIT_BOX = new BoundingBox(Vector.NEGATIVE_ONES, Vector.ONES);
    static ZERO_BOX = new BoundingBox(Vector.ZERO, Vector.ZERO);

    constructor(min_bounds: Vector, max_bounds: Vector) {
        this.min_bounds = min_bounds;
        this.max_bounds = max_bounds;
    }

    encloses_vector(location: Vector){
        return this.encloses(location.x, location.y, location.z);
    }

    encloses(x = 0, y = 0, z = 0) {
        return (
            this.min_bounds.x <= x &&
            this.min_bounds.y <= y &&
            this.min_bounds.z <= z &&
            this.max_bounds.x >= x &&
            this.max_bounds.y >= y &&
            this.max_bounds.z >= z
        )
    }

    encloses_box(box: BoundingBox){
        return (
            this.min_bounds.x <= box.min_bounds.x &&
            this.min_bounds.y <= box.min_bounds.y &&
            this.min_bounds.z <= box.min_bounds.z &&
            this.max_bounds.x >= box.max_bounds.x &&
            this.max_bounds.y >= box.max_bounds.y &&
            this.max_bounds.z >= box.max_bounds.z
        )
    }

}