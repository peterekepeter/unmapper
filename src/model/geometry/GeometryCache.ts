import { Actor } from "../Actor"
import { BoundingBox } from "../BoundingBox";
import { Vector } from "../Vector";
import { ActorGeometryCache } from "./ActorGeometryCache";

export class GeometryCache
{
    private actor_caches : ActorGeometryCache[] = [];

    set actors(actors: Actor[]){
        this.actor_caches.length = actors.length
        for (let i=0; i<actors.length; i++){
            const actor = actors[i]
            const actor_cache = this.actor_caches[i]
            if (!actor_cache || actor_cache.is_for(actor)){
                this.actor_caches[i] = new ActorGeometryCache(actor)
            }
        } 
    }

    get length(): number {
        return this.actor_caches.length
    }

    get_bounding_box(index: number): BoundingBox {
        return this.actor_caches[index].bounding_box
    }

    get_world_transformed_vertexes(index: number): Vector[] {
        return this.actor_caches[index].world_vertexes
    }

}


