import { Actor } from "../../model/Actor"
import { ActorSelection, DEFAULT_ACTOR_SELECTION, DEFAULT_EDITOR_SELECTION, EditorSelection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { fast_closest_point_to_line_inside_segment } from "../../model/geometry/closest_point_to_line"
import { distance_2d_to_point, distance_to_line_segment } from "../../model/geometry/distance-functions"
import { GeometryCache } from "../../model/geometry/GeometryCache"
import { intersect_segments } from "../../model/geometry/intersect_segments"
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
        state: EditorState,
        canvas_x: number,
        canvas_y: number,
        custom_geometry_cache: GeometryCache,
    ): [
            Vector, number,
        ] {

        const map = state.map

        let best_vertex_distance = Number.MAX_VALUE
        let best_vertex_location = Vector.ZERO

        let best_edge_midpoint_distance = Number.MAX_VALUE
        let best_edge_midpoint_location = Vector.ZERO
        
        let best_edge_distance = Number.MAX_VALUE
        let best_edge_location = Vector.ZERO

        let best_right_angle_distance = Number.MAX_VALUE
        let best_right_angle_location = Vector.ZERO

        let best_polygon_mean_distance = Number.MAX_VALUE
        let best_polygon_mean_location = Vector.ZERO

        let best_edge_intersection_distance = Number.MAX_VALUE
        let best_edge_intersection_location = Vector.ZERO

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
                    if (distance < best_vertex_distance) {
                        best_vertex_location = vertex
                        best_vertex_distance = distance
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
                    const distance = distance_2d_to_point(canvas_x, canvas_y, x0, y0)
                    if (distance < best_edge_midpoint_distance) {
                        best_edge_midpoint_location = midpoint
                        best_edge_midpoint_distance = distance
                    }
                }
            }

            // snap edge so that a right angle is formed
            if (state.interaction_buffer.points.length >= 2) {
                // this requires a starting point
                const first_point = state.interaction_buffer.points[0]
                for (const edge of actor.brushModel.edges) {
                    const a = world_vertexes[edge.vertexIndexA]
                    const b = world_vertexes[edge.vertexIndexB]
                    const c = fast_closest_point_to_line_inside_segment(a, b, first_point)
                    if (c == null){
                        continue // no such point
                    }
                    const x = this.render_transform.view_transform_x(c)
                    const y = this.render_transform.view_transform_y(c)

                    const distance = distance_2d_to_point(canvas_x, canvas_y, x, y)
                    if (distance < best_right_angle_distance) {
                        best_right_angle_location = c
                        best_right_angle_distance = distance
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
                    const distance = distance_to_line_segment(canvas_x, canvas_y, ax, ay, bx, by)
                    if (distance < best_edge_distance) {
                        const distance_to_a = distance_2d_to_point(canvas_x, canvas_y, ax, ay)
                        const distance_to_b = distance_2d_to_point(canvas_x, canvas_y, bx, by)
                        const whole = distance_to_a + distance_to_b
                        best_edge_location = a.scale(distance_to_b).add_vector(b.scale(distance_to_a)).scale(1 / whole)
                        best_edge_distance = distance
                    }
                }
            }

            // snap polygon median
            for (const polygon of actor.brushModel.polygons) {
                const median = polygon.median
                const x0 = this.render_transform.view_transform_x(median)
                const y0 = this.render_transform.view_transform_y(median)
                if (!isNaN(x0) && !isNaN(y0)) {
                    const distance = distance_2d_to_point(canvas_x, canvas_y, x0, y0)
                    if (distance < best_polygon_mean_distance) {
                        best_polygon_mean_location = median
                        best_polygon_mean_distance = distance
                    }
                }
            }
        }
        
        const [intersection_point, intersection_point_distance] = this.find_nearest_intersection(map, canvas_x, canvas_y, 16, custom_geometry_cache)
        if (intersection_point != null && intersection_point_distance < best_edge_intersection_distance) {
            best_edge_intersection_location = intersection_point
            best_edge_intersection_distance = intersection_point_distance
        }
        
        let best_match_location: Vector = null
        let best_distance = Number.MAX_VALUE

        if (best_vertex_distance < best_distance){
            best_distance = best_vertex_distance
            best_match_location = best_vertex_location
        }

        if (best_edge_intersection_distance < best_distance){
            best_distance = best_edge_intersection_distance
            best_match_location = best_edge_intersection_location
        }

        if (best_right_angle_distance < best_distance){
            best_distance = best_right_angle_distance
            best_match_location = best_right_angle_location
        }

        best_edge_midpoint_distance = Math.max(best_edge_midpoint_distance, 4 - best_distance)

        if (best_edge_midpoint_distance < best_distance){
            best_distance = best_edge_midpoint_distance
            best_match_location = best_edge_midpoint_location
        }
        
        best_polygon_mean_distance = Math.max(best_polygon_mean_distance, 4 - best_distance)

        if (best_polygon_mean_distance < best_distance){
            best_distance = best_polygon_mean_distance
            best_match_location = best_polygon_mean_location
        }

        best_edge_distance = Math.max(best_edge_distance, 24 - best_distance)

        if (best_edge_distance < best_distance){
            best_distance = best_edge_distance
            best_match_location = best_edge_location
        }

        return [best_match_location, best_distance]
    }

    find_nearest_intersection(map: UnrealMap, canvas_x: number, canvas_y: number, max_distance: number, custom_geometry_cache: GeometryCache): [Vector|null, number] {
        const query = this.find_edges_in_radius(map, canvas_x, canvas_y, max_distance, custom_geometry_cache)
        
        const segments: { a: Vector, b: Vector, ax: number, ay: number, bx: number, by: number, actor_index: number, edge_index: number }[] =[] 
        for (const actor_selection of query.actors){
            const actor_index = actor_selection.actor_index
            const world_vertexes = custom_geometry_cache.get_world_transformed_vertexes(actor_index)
            const brush = map.actors[actor_index].brushModel
            for (const edge_index of actor_selection.edges) {
                const edge = brush.edges[edge_index]
                const a = world_vertexes[edge.vertexIndexA]
                const b = world_vertexes[edge.vertexIndexB]
                const ax = this.render_transform.view_transform_x(a)
                const ay = this.render_transform.view_transform_y(a)
                const bx = this.render_transform.view_transform_x(b)
                const by = this.render_transform.view_transform_y(b)
                if (!segments.find(s => s.ax === ax && s.ay === ay && s.bx === bx && s.by === by)){
                    segments.push({ a, b, ax, ay, bx, by, actor_index, edge_index })
                }
            }
        }

        let best_i = -1, best_j = -1, best_distance = Number.MAX_SAFE_INTEGER, best_canvas_intersection = Vector.ZERO
        for (let i=0; i<segments.length; i++){
            for (let j=i+1; j<segments.length; j++) {
                const s0 = segments[i]
                const s1 = segments[j]
                const canvas_intersection = intersect_segments(
                    new Vector(s0.ax, s0.ay, 0), 
                    new Vector(s0.bx, s0.by, 0), 
                    new Vector(s1.ax, s1.ay, 0), 
                    new Vector(s1.bx, s1.by, 0), 
                )
                if (canvas_intersection == null){
                    continue
                }
                const distance = distance_2d_to_point(canvas_intersection.x, canvas_intersection.y, canvas_x, canvas_y)
                if (distance < best_distance){
                    best_distance = distance
                    best_i = i
                    best_j = j
                    best_canvas_intersection = canvas_intersection
                }
            }
        }
        if (best_i === -1){
            // no intersection found 
            return [null, best_distance]
        }
        if (this.render_transform.can_3d_transform){
            // now find intersection point in 3d
            const s0 = segments[best_i]
            const s1 = segments[best_j]
            return [intersect_segments(s0.a, s0.b, s1.a, s1.b), best_distance]
        } else {
            // on 2d views, convert canvas point to a 3d point
            return [
                this.render_transform.canvas_to_world_location(best_canvas_intersection.x, best_canvas_intersection.y),
                best_distance,
            ]
        }
    }

    find_edges_in_radius(
        map: UnrealMap,
        canvas_x: number,  
        canvas_y: number, 
        max_distance: number,
        geometry_cache: GeometryCache,
    ): EditorSelection {

        let result_actors: ActorSelection[] = null

        for (let actor_index = 0; actor_index<map.actors.length; actor_index++) {
            const actor = map.actors[actor_index]
            
            if (actor.brushModel == null) {
                continue // skip actors which are not selected or don't have a brushModel
            }
            let result_edge_list: number[] = null
            const vertexes = geometry_cache.get_world_transformed_vertexes(actor_index)

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
                    if (distance <= max_distance) {
                        if (!result_edge_list){
                            result_edge_list = []
                        }
                        result_edge_list.push(edge_index)
                    }
                }
            }

            if (result_edge_list){
                const result_actor_selection = {
                    ...DEFAULT_ACTOR_SELECTION, 
                    actor_index,
                    edges: result_edge_list,
                }
                if (!result_actors){
                    result_actors = []
                }
                result_actors.push(result_actor_selection)
            }
        }

        if (!result_actors){
            return DEFAULT_EDITOR_SELECTION
        }
        const editor_selection: EditorSelection = { actors: result_actors }
        return editor_selection
    }

}
