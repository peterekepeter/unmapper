import { Actor } from "../../model/Actor"
import { DEFAULT_ACTOR_SELECTION, DEFAULT_EDITOR_SELECTION, EditorSelection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { distance_2d_to_point, distance_to_line_segment } from "../../model/geometry/distance-functions"
import { GeometryCache } from "../../model/geometry/GeometryCache"
import { UnrealMap } from "../../model/UnrealMap"
import { Vector } from "../../model/Vector"
import { ViewTransform } from "../ViewTransform"

export class WorldViewportQueries {

    public render_transform: ViewTransform

    constructor(private geometry_cache: GeometryCache) { }


    find_selection_at_point(
        state:EditorState,
        canvas_x: number,
        canvas_y: number,
    ): EditorSelection {
        const MAX_DISTANCE = 16
        const [vertex_actor, vertex, vertex_distance] = 
            this.find_nearest_vertex(state, canvas_x, canvas_y)
        const [edge_actor, edge, raw_edge_distance] = 
            this.find_nearest_edge(state, canvas_x, canvas_y)
        const [polygon_actor, polygon, polygon_distance] = 
            this.find_nearest_polygon(state, canvas_x, canvas_y)
        
        const edge_distance = Math.max(raw_edge_distance, Math.max(16 - vertex_distance, 16 - polygon_distance))

        let best_distance = Number.MAX_SAFE_INTEGER
        let selection: EditorSelection = DEFAULT_EDITOR_SELECTION

        if (vertex_distance < best_distance && vertex_distance < MAX_DISTANCE)
        {
            best_distance = vertex_distance
            selection = { actors: [{ ...DEFAULT_ACTOR_SELECTION, actor_index: vertex_actor, vertexes: [vertex] }] }
        }

        if (edge_distance < best_distance && edge_distance < MAX_DISTANCE)
        {
            best_distance = edge_distance
            selection = { actors: [{ ...DEFAULT_ACTOR_SELECTION, actor_index: edge_actor, edges: [edge] }] }
        }

        if (polygon_distance < best_distance && polygon_distance < MAX_DISTANCE)
        {
            best_distance = polygon_distance
            selection = { actors: [{ ...DEFAULT_ACTOR_SELECTION, actor_index: polygon_actor, polygons: [polygon] }] }
        }
        return selection
    }
    
    find_nearest_actor(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number,
    ): Actor {
        const MAX_DISTANCE = 8
        let best_match: Actor = null
        let best_distance = Number.MAX_VALUE
        for (let actor_index = map.actors.length - 1; actor_index >= 0; actor_index--) {
            const actor = map.actors[actor_index] // reverse iterate to find topmost actor
            if (actor.brushModel != null) {

                const vertexes = this.geometry_cache.get_world_transformed_vertexes(actor_index)

                for (const edge of actor.brushModel.edges) {
                    const p0 = vertexes[edge.vertexIndexA]
                    const x0 = this.render_transform.view_transform_x(p0)
                    const y0 = this.render_transform.view_transform_y(p0)
                    const p1 = vertexes[edge.vertexIndexB]
                    const x1 = this.render_transform.view_transform_x(p1)
                    const y1 = this.render_transform.view_transform_y(p1)
                    if (!isNaN(x0) && !isNaN(x1)) {
                        const distance = distance_to_line_segment(canvas_x, canvas_y, x0, y0, x1, y1)
                        if (distance < best_distance) {
                            best_match = actor
                            best_distance = distance
                        }
                    }
                }
            }
        }
        if (best_distance > MAX_DISTANCE) {
            best_match = null // to far away
        }
        return best_match
    }

    find_nearest_vertex(
        state: EditorState,
        canvasX: number,
        canvasY: number,
    ): [
            number, number, number,
        ] {
        let best_actor = -1
        let best_vertex = -1
        let best_distance = Number.MAX_VALUE
        // reverse iterate to find topmost actor
        for (let i=state.selection.actors.length - 1; i >= 0; i--) {
            const actor_selection = state.selection.actors[i]
            const actor_index = actor_selection.actor_index
            const actor = state.map.actors[actor_index] 

            if (actor.brushModel == null) {
                continue // skip actors which are not selected or don't have a brushModel
            }

            const transformed_vertexes = this.geometry_cache.get_world_transformed_vertexes(actor_index)
            const vertexes = actor.brushModel.vertexes

            for (let vertex_index = vertexes.length - 1; vertex_index >= 0; vertex_index--) {
                const p0 = transformed_vertexes[vertex_index]
                const x0 = this.render_transform.view_transform_x(p0)
                const y0 = this.render_transform.view_transform_y(p0)
                if (!isNaN(x0) && !isNaN(y0)) {
                    const distance = distance_2d_to_point(canvasX, canvasY, x0, y0)
                    if (distance < best_distance) {
                        best_actor = actor_index
                        best_vertex = vertex_index
                        best_distance = distance
                    }
                }
            }
        }
        return [best_actor, best_vertex, best_distance]
    }

    find_nearest_edge(
        state: EditorState,
        canvas_x: number, 
        canvas_y: number,
    ): [number, number, number] {
        let best_actor = -1
        let best_edge = -1
        let best_distance = Number.MAX_VALUE
        // reverse iterate to find topmost actor
        for (let i=state.selection.actors.length - 1; i >= 0; i--) {
            const actor_selection = state.selection.actors[i]
            const actor_index = actor_selection.actor_index
            const actor = state.map.actors[actor_index] 
            
            if (actor.brushModel == null) {
                continue // skip actors which are not selected or don't have a brushModel
            }

            const vertexes = this.geometry_cache.get_world_transformed_vertexes(actor_index)

            for (let edge_index = 0; edge_index<actor.brushModel.edges.length; edge_index++) {
                const edge = actor.brushModel.edges[edge_index]
                const p0 = vertexes[edge.vertexIndexA]
                const x0 = this.render_transform.view_transform_x(p0)
                const y0 = this.render_transform.view_transform_y(p0)
                const p1 = vertexes[edge.vertexIndexB]
                const x1 = this.render_transform.view_transform_x(p1)
                const y1 = this.render_transform.view_transform_y(p1)
                if (!isNaN(x0) && !isNaN(x1)) {
                    const distance = distance_to_line_segment(canvas_x, canvas_y, x0, y0, x1, y1)
                    if (distance < best_distance) {
                        best_actor = actor_index
                        best_edge = edge_index
                        best_distance = distance
                    }
                }
            }
        }
        return [best_actor, best_edge, best_distance]
    }

    find_nearest_polygon(state: EditorState, canvas_x: number, canvas_y: number): [number, number, number] {
        let best_actor = -1
        let best_vertex = -1
        let best_distance = Number.MAX_VALUE
        // reverse iterate to find topmost actor
        for (let i=state.selection.actors.length - 1; i >= 0; i--) {
            const actor_selection = state.selection.actors[i]
            const actor_index = actor_selection.actor_index
            const actor = state.map.actors[actor_index] 

            if (actor.brushModel == null) {
                continue // skip actors which are not selected or don't have a brushModel
            }

            const polygon_centers = this.geometry_cache.get_world_transformed_polygon_centers(actor_index)
            const polygons = actor.brushModel.polygons

            for (let polygon_index = polygons.length - 1; polygon_index >= 0; polygon_index--) {
                const p0 = polygon_centers[polygon_index]
                const x0 = this.render_transform.view_transform_x(p0)
                const y0 = this.render_transform.view_transform_y(p0)
                if (!isNaN(x0) && !isNaN(y0)) {
                    const distance = distance_2d_to_point(canvas_x, canvas_y, x0, y0)
                    if (distance < best_distance) {
                        best_actor = actor_index
                        best_vertex = polygon_index
                        best_distance = distance
                    }
                }
            }
        }
        return [best_actor, best_vertex, best_distance]
    }

    find_actors_in_box(
        map: UnrealMap,
        canvas_x0: number,
        canvas_y0: number,
        canvas_x1: number,
        canvas_y1: number,
    ): number[] {
        const result = []
        for (let actor_index = 0; actor_index < map.actors.length; actor_index++) {
            const actor = map.actors[actor_index]
            const x0 = this.render_transform.view_transform_x(actor.location)
            const y0 = this.render_transform.view_transform_y(actor.location)
            if (canvas_x0 <= x0 && x0 <= canvas_x1 &&
                canvas_y0 <= y0 && y0 <= canvas_y1) {
                result.push(actor_index)
            }
        }
        return result
    }

    find_vertexes_of_selected_actors_in_box(
        state: EditorState,
        canvas_x0: number,
        canvas_y0: number,
        canvas_x1: number,
        canvas_y1: number,
        custom_geometry_cache: GeometryCache,
    ): EditorSelection {
        const result: EditorSelection = { actors: [] }
        for (const selected_actor of state.selection.actors) {
            const actor_index = selected_actor.actor_index
            const vertex_selection_result = []
            const polygon_selection_result = []
            const edge_selection_result = []
            const vertexes = custom_geometry_cache.get_world_transformed_vertexes(actor_index)
            const polygon_centers = custom_geometry_cache.get_world_transformed_polygon_centers(actor_index)
            for (let vertex_index = 0; vertex_index < vertexes.length; vertex_index++) {
                const vertex = vertexes[vertex_index]
                const x0 = this.render_transform.view_transform_x(vertex)
                const y0 = this.render_transform.view_transform_y(vertex)
                if (canvas_x0 <= x0 && x0 <= canvas_x1 &&
                    canvas_y0 <= y0 && y0 <= canvas_y1) {
                    vertex_selection_result.push(vertex_index)
                }
            }
            for (let i = 0; i < polygon_centers.length; i++){
                const polygon_center = polygon_centers[i]
                const x0 = this.render_transform.view_transform_x(polygon_center)
                const y0 = this.render_transform.view_transform_y(polygon_center)
                if (canvas_x0 <= x0 && x0 <= canvas_x1 &&
                    canvas_y0 <= y0 && y0 <= canvas_y1) {
                    polygon_selection_result.push(i)
                }
            }
            if (state.map.actors[actor_index].brushModel){
                const edges = state.map.actors[actor_index].brushModel.edges
                for (let i=0; i<edges.length; i++){
                    const vertex_a = vertexes[edges[i].vertexIndexA]
                    const vertex_b = vertexes[edges[i].vertexIndexB]
                    const x0_a = this.render_transform.view_transform_x(vertex_a)
                    const y0_a = this.render_transform.view_transform_y(vertex_a)
                    const x0_b = this.render_transform.view_transform_x(vertex_b)
                    const y0_b = this.render_transform.view_transform_y(vertex_b)
                    if (canvas_x0 <= x0_a && x0_a <= canvas_x1 &&
                        canvas_y0 <= y0_a && y0_a <= canvas_y1 && 
                        canvas_x0 <= x0_b && x0_b <= canvas_x1 &&
                        canvas_y0 <= y0_b && y0_b <= canvas_y1) {
                        edge_selection_result.push(i)
                    }
                }
            }
            result.actors.push({ 
                ...DEFAULT_ACTOR_SELECTION, 
                actor_index, 
                vertexes: vertex_selection_result, 
                polygons: polygon_selection_result,
                edges: edge_selection_result,
            })
        }
        return result
    }

    find_nearest_snapping_point(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number,
        custom_geometry_cache: GeometryCache,
    ): [
            Vector, number,
        ] {
        let best_match_location: Vector = null
        let best_distance = Number.MAX_VALUE
        for (let actor_index = map.actors.length - 1; actor_index >= 0; actor_index--) {
            const actor = map.actors[actor_index] // reverse iterate to find topmost actor
            if (actor.brushModel == null) {
                continue // skip actors don't have a brushModel
            }

            const world_vertexes = custom_geometry_cache.get_world_transformed_vertexes(actor_index)

            // snap to vertexes
            for (const vertex of world_vertexes) {
                const x0 = this.render_transform.view_transform_x(vertex)
                const y0 = this.render_transform.view_transform_y(vertex)
                if (!isNaN(x0) && !isNaN(y0)) {
                    const distance = distance_2d_to_point(canvas_x, canvas_y, x0, y0)
                    if (distance < best_distance) {
                        best_match_location = vertex
                        best_distance = distance
                    }
                }
            }

            // snap edge midpoint
            for (const edge of actor.brushModel.edges) {
                const a = world_vertexes[edge.vertexIndexA]
                const b = world_vertexes[edge.vertexIndexB]
                const midpoint = a.add_vector(b).scale(0.5)
                const x0 = this.render_transform.view_transform_x(midpoint)
                const y0 = this.render_transform.view_transform_y(midpoint)
                if (!isNaN(x0) && !isNaN(y0)) {
                    let distance = distance_2d_to_point(canvas_x, canvas_y, x0, y0)
                    distance += 2 // HACK: deprioritizes midpoint snap
                    if (distance < best_distance) {
                        best_match_location = midpoint
                        best_distance = distance
                    }
                }
            }

            // snap to edges
            for (const edge of actor.brushModel.edges) {
                const a = world_vertexes[edge.vertexIndexA]
                const b = world_vertexes[edge.vertexIndexB]
                const ax = this.render_transform.view_transform_x(a)
                const ay = this.render_transform.view_transform_y(a)
                const bx = this.render_transform.view_transform_x(b)
                const by = this.render_transform.view_transform_y(b)
                if (!isNaN(ax) && !isNaN(bx)) {
                    let distance = distance_to_line_segment(canvas_x, canvas_y, ax, ay, bx, by)
                    distance += 4 // HACK: deprioritizes edge snap
                    if (distance < best_distance) {
                        const distance_to_a = distance_2d_to_point(canvas_x, canvas_y, ax, ay)
                        const distance_to_b = distance_2d_to_point(canvas_x, canvas_y, bx, by)
                        const whole = distance_to_a + distance_to_b
                        best_match_location = a.scale(distance_to_b).add_vector(b.scale(distance_to_a)).scale(1 / whole)
                        best_distance = distance
                    }
                }
            }

            // snap polygon median
            for (const polygon of actor.brushModel.polygons) {
                const median = polygon.median
                const x0 = this.render_transform.view_transform_x(median)
                const y0 = this.render_transform.view_transform_y(median)
                if (!isNaN(x0) && !isNaN(y0)) {
                    let distance = distance_2d_to_point(canvas_x, canvas_y, x0, y0)
                    distance += 2 // HACK: deprioritizes polygon median snap
                    if (distance < best_distance) {
                        best_match_location = median
                        best_distance = distance
                    }
                }
            }
        }
        return [best_match_location, best_distance]
    }
}
