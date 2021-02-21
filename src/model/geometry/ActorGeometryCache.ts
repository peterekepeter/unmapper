import { Actor } from "../Actor";
import { BoundingBox } from "../BoundingBox";
import { Vector } from "../Vector";

export class ActorGeometryCache {

    private _actor: Actor;
    private _cached_world_vertexes: Vector[];
    private _cached_bounding_box: BoundingBox;

    constructor(actor: Actor) {
        this._actor = actor
    }

    get world_vertexes(): Vector[] {
        if (this._cached_world_vertexes) {
            return this._cached_world_vertexes
        }

        const { postScale, rotation, mainScale, brushModel } = this._actor
        const pivot = this._actor.prePivot || Vector.ZERO
        const location = this._actor.location || Vector.ZERO

        const matrix = postScale.toMatrix()
            .multiply(rotation.toMatrix())
            .multiply(mainScale.toMatrix())

        const vertexes = brushModel.vertexes.map(v => 
            matrix.apply(v.position.subtractVector(pivot))
            .addVector(location)
        )

        this._cached_world_vertexes = vertexes
        return this._cached_world_vertexes
    }

    get bounding_box(): BoundingBox {
        if (this._cached_bounding_box){
            return this._cached_bounding_box
        }
        const box = BoundingBox.from_vectors_list(this.world_vertexes)
        this._cached_bounding_box = box
        return this._cached_bounding_box
    }

    is_for(actor: Actor): boolean {
        return this._actor === actor
    }

}

    