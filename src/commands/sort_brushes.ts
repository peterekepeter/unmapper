import { ICommandInfoV2 } from "../controller/command"
import { Actor } from "../model/Actor"
import { shuffle } from "../model/algorithms/shuffle"
import { CsgOperation } from "../model/CsgOperation"
import { EditorState } from "../model/EditorState"
import { nearest_power_of_two } from "../model/ExtendedMath"
import { GeometryCache } from "../model/geometry/GeometryCache"
import { PolyFlags } from "../model/PolyFlags"

export const sort_brushes_command: ICommandInfoV2 = {
    description: 'Shuffle and sort brushes in order to improve BSP quality',
    exec: sort_brushes,
}

function sort_brushes(state: EditorState): EditorState {
    const actors = state.map.actors
    
    const cache = new GeometryCache()
    cache.actors = actors

    // find logical dependencies, changing the order of these will break the map
    const dependencies = get_brush_order_dependencies(actors, cache)

    const actor_sizes = new Array<number>(actors.length)
    let max_size = 1
    for (let i=0; i<actors.length; i++){
        let actor_size = 0
        if (actors[i].brushModel != null){
            const box = cache.get_bounding_box(i)
            actor_size = Math.max(
                box.max_x - box.min_x,
                box.max_y - box.min_y,
                box.max_z - box.min_z,
            )
        }
        actor_sizes[i] = nearest_power_of_two(actor_size)
        max_size = Math.max(max_size, actor_size)
    }

    const priority = new Array<number>(actors.length)
    for (let i=0; i<actors.length; i++){
        if (actors[i].brushModel == null){
            priority[i] = 99
        }
        else {
            const relative_size = actor_sizes[i] / max_size
            priority[i] = get_brush_sort_priority(actors[i]) - relative_size
        }
    }
    
    const result = shuffle(actors.map((actor, i) => ({ original_index: i, actor })))
    result.sort((a, b) => {
        const a_dependencies = dependencies.get(a.original_index)
        if (a_dependencies && a_dependencies.has(b.original_index)){
            // a depends on b
            return -1
        }
        const b_dependencies = dependencies.get(b.original_index)
        if (b_dependencies && b_dependencies.has(a.original_index)){
            // b depends on a
            return +1
        }
        return priority[a.original_index] - priority[b.original_index]
    })

    return { 
        ...state,
        map: {
            ...state.map,
            actors: result.map(r => r.actor),
        },
    }
}

function get_brush_sort_priority(actor: Actor) {
    if (actor.csgOperation === CsgOperation.Subtract){
        return 1
    }
    if ((actor.polyFlags & PolyFlags.NonSolid) !== 0)
    {
        return 7
    }
    if ((actor.polyFlags & PolyFlags.SemiSolid) !== 0){
        return 5
    }
    return 3
}

function get_brush_order_dependencies(actors: Actor[], cache: GeometryCache){
    const dependencies = new Map<number, Set<number>>()
    const subtract = CsgOperation.Subtract // when mixed with additive brushes, we cannot reorder
    for (let i=0; i<actors.length; i++){
        const actor_i = actors[i]
        if (actor_i.brushModel == null){
            continue
        }
        
        for (let j=i+1; j<actors.length; j++)
        {
            const actor_j = actors[j]
            if (actor_j.brushModel == null){
                continue
            }
            
            if (actor_i.csgOperation === subtract && actor_j.csgOperation !== subtract ||
                actor_i.csgOperation !== subtract && actor_j.csgOperation === subtract) 
            {
                const actor_i_box = cache.get_bounding_box(i)
                const actor_j_box = cache.get_bounding_box(j)

                if (actor_i_box.intersects(actor_j_box)){
                    // must keep these in order
                    if (!dependencies.get(j)){
                        dependencies.set(j, new Set())
                    }
                    dependencies.get(j).add(i)
                }
            }

        }
    }
    return dependencies
}
