import { Actor } from "../Actor"
import { ActorSelection } from "../EditorSelection"

export function get_selected_vertex_list(
    actor: Actor, 
    selection: ActorSelection, 
    options?:{ 
        edge_to_vertex?: boolean,
        polygon_to_vertex?: boolean
    },
):number[]{
    const result = new Set<number>(selection.vertexes)
    if (options?.edge_to_vertex) {
        for (const edge_index of selection.edges){
            const edge = actor.brushModel.edges[edge_index]
            result.add(edge.vertexIndexA)
            result.add(edge.vertexIndexB)
        }
    }
    if (options?.polygon_to_vertex){
        for (const polygon_index of selection.polygons){
            const polygon = actor.brushModel.polygons[polygon_index]
            for (const vertex_index of polygon.vertexes){
                result.add(vertex_index)
            }
        }
    }
    return [...result]
}
