import { GenericSelection } from "../commands/selection/select_generic"
import { Actor } from "../model/Actor"
import { distance_2d_to_point, distance_to_line_segment } from "../model/geometry/distance-functions"
import { GeometryCache } from "../model/geometry/GeometryCache"
import { UnrealMap } from "../model/UnrealMap"
import { Vector } from "../model/Vector"
import { ViewTransform } from "./ViewTransform"

export class ViewportQueries {

    public render_transform: ViewTransform

    constructor(private geometry_cache: GeometryCache) { }

    find_nearest_actor(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number
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
        map: UnrealMap,
        canvasX: number,
        canvasY: number): [
            Actor, number
        ] {
        const MAX_DISTANCE = 8
        let best_match_actor: Actor = null
        let best_match_vertex = -1
        let best_distance = Number.MAX_VALUE
        for (let actor_index = map.actors.length - 1; actor_index >= 0; actor_index--) {
            const actor = map.actors[actor_index] // reverse iterate to find topmost actor
            if (!actor.selected || actor.brushModel == null) {
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
                        best_match_actor = actor
                        best_match_vertex = vertex_index
                        best_distance = distance
                    }
                }
            }
        }
        if (best_distance > MAX_DISTANCE) {
            best_match_actor = null
            best_match_vertex = -1
        }
        return [best_match_actor, best_match_vertex]
    }

    find_actors_in_box(
        map: UnrealMap,
        canvas_x0: number,
        canvas_y0: number,
        canvas_x1: number,
        canvas_y1: number
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
        map: UnrealMap,
        canvas_x0: number,
        canvas_y0: number,
        canvas_x1: number,
        canvas_y1: number,
        custom_geometry_cache: GeometryCache
    ): GenericSelection {
        const result: GenericSelection = { actors: [] }
        for (let actor_index = 0; actor_index < map.actors.length; actor_index++) {
            const actor = map.actors[actor_index]
            if (!actor.selected || !actor.brushModel) {
                continue
            }
            const brush_result = []
            const vertexes = custom_geometry_cache.get_world_transformed_vertexes(actor_index)
            for (let vertex_index = 0; vertex_index < vertexes.length; vertex_index++) {
                const vertex = vertexes[vertex_index]
                const x0 = this.render_transform.view_transform_x(vertex)
                const y0 = this.render_transform.view_transform_y(vertex)
                if (canvas_x0 <= x0 && x0 <= canvas_x1 &&
                    canvas_y0 <= y0 && y0 <= canvas_y1) {
                    brush_result.push(vertex_index)
                }
            }
            if (brush_result.length > 0) {
                result.actors.push({ actor_index, vertexes: brush_result })
            }
        }
        return result
    }

    find_nearest_snapping_point(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number,
        custom_geometry_cache: GeometryCache): [
            Vector, number
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