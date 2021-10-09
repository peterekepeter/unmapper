import { Actor } from "../Actor";
import { ActorSelection } from "../EditorSelection";


export function get_selected_uv_vertex_list(
    actor: Actor,
    selection: ActorSelection["polygon_vertexes"][0],
    options?: {
        edge_to_vertex?: boolean;
    }
): number[] {
    const result = new Set<number>(selection.vertexes);
    if (options?.edge_to_vertex) {
        for (const edge_index of selection.edges) {
            const edge = actor.brushModel.edges[edge_index];
            result.add(edge.vertexIndexA);
            result.add(edge.vertexIndexB);
        }
    }
    return [...result];
}
