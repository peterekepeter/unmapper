import { Actor } from "../../model/Actor"
import { DEFAULT_ACTOR_POLYGON_SELECTION, DEFAULT_ACTOR_SELECTION, DEFAULT_EDITOR_SELECTION, EditorSelection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { NotImplementedError } from "../../model/error/NotImplementedError"
import { distance_2d_to_point, distance_to_line_segment } from "../../model/geometry/distance-functions"
import { GeometryCache } from "../../model/geometry/GeometryCache"
import { UnrealMap } from "../../model/UnrealMap"
import { get_brush_polygon_vertex_uvs } from "../../model/uvmap/vertex_uv"
import { Vector } from "../../model/Vector"
import { ViewTransform } from "../ViewTransform"
import { ViewportPointQueryResult } from "./ViewportPointQueryResult"

export class UvViewportQueries {

    public render_transform: ViewTransform

    find_nearest_actor(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number,
    ): Actor {
        return null
    }

    find_selection_at_point(
        state:EditorState,
        canvas_x: number,
        canvas_y: number,
    ): EditorSelection {
        const MAX_DISTANCE = 16

        let best_distance = Number.MAX_SAFE_INTEGER
        let selection: EditorSelection = DEFAULT_EDITOR_SELECTION

        const [vertex_actor, vertex_polygon, vertex_polygon_vertex, vertex_distance] = 
            this.find_nearest_polygon_vertex(state, canvas_x, canvas_y)

        const [edge_actor, edge_polygon, edge_polygon_edge, raw_edge_distance] = 
            this.find_nearest_edge(state, canvas_x, canvas_y)

        const edge_distance = Math.max(raw_edge_distance, 16 - vertex_distance)

        if (vertex_distance < best_distance && vertex_distance <= MAX_DISTANCE){
            best_distance = vertex_distance
            selection = {
                actors: [
                    {
                        ...DEFAULT_ACTOR_SELECTION,
                        actor_index: vertex_actor,
                        polygon_vertexes: [
                            {
                                ...DEFAULT_ACTOR_POLYGON_SELECTION,
                                polygon_index: vertex_polygon,
                                vertexes: [vertex_polygon_vertex],
                            },
                        ],
                    },
                ], 
            }
        }

        if (edge_distance < best_distance && edge_distance <= MAX_DISTANCE){
            
            best_distance = vertex_distance
            selection = {
                actors: [
                    {
                        ...DEFAULT_ACTOR_SELECTION,
                        actor_index: edge_actor,
                        polygon_vertexes: [
                            {
                                ...DEFAULT_ACTOR_POLYGON_SELECTION,
                                polygon_index: edge_polygon,
                                edges: [edge_polygon_edge],
                            },
                        ],
                    },
                ], 
            }
        }
        
        return selection
    }

    private find_nearest_polygon_vertex(
        state: EditorState,
        canvas_x: number,
        canvas_y: number,
    ): [number, number, number, number] 
    {
        let best_actor = -1
        let best_polygon = -1
        let best_polygon_vertex = -1
        let best_distance = Number.MAX_VALUE
        for (const actor_selection of state.selection.actors){
            const actor = state.map.actors[actor_selection.actor_index]
            const model = actor.brushModel
            if (!model) continue
            for (let polygon_index = 0; polygon_index < model.polygons.length; polygon_index++) {
                const uv = get_brush_polygon_vertex_uvs(model, polygon_index)
                for (let vertex_index=0; vertex_index<uv.length; vertex_index++) {
                    const current_uv = uv[vertex_index]
                    const x = this.render_transform.view_transform_x(current_uv)
                    const y = this.render_transform.view_transform_y(current_uv)

                    if (isNaN(x) || isNaN(y)) { continue }
                    
                    const distance = distance_2d_to_point(canvas_x, canvas_y, x, y)
                    if (distance < best_distance){
                        best_distance = distance
                        best_actor = actor_selection.actor_index
                        best_polygon = polygon_index
                        best_polygon_vertex = vertex_index
                    }
                }
            }
            
        }

        return [best_actor, best_polygon, best_polygon_vertex, best_distance]
    }

    find_nearest_edge(
        state: EditorState,
        canvas_x: number, 
        canvas_y: number,
    ): [number, number, number, number] {
        let best_actor = -1
        let best_polygon = -1
        let best_polygon_edge = -1
        let best_distance = Number.MAX_VALUE
        for (const actor_selection of state.selection.actors){
            const actor = state.map.actors[actor_selection.actor_index]
            const model = actor.brushModel
            if (!model) continue
            for (let polygon_index = 0; polygon_index < model.polygons.length; polygon_index++) {
                const uv = get_brush_polygon_vertex_uvs(model, polygon_index)

                for (let edge_index =0; edge_index<uv.length; edge_index++){
                    const first_polygon_vertex = edge_index
                    const second_polygon_vertex = first_polygon_vertex !== uv.length -1 ? first_polygon_vertex + 1 : 0
                    const first = uv[first_polygon_vertex]
                    const second = uv[second_polygon_vertex]
                    const x0 = this.render_transform.view_transform_x(first)
                    const y0 = this.render_transform.view_transform_y(first)
                    const x1 = this.render_transform.view_transform_x(second)
                    const y1 = this.render_transform.view_transform_y(second)
                    const invalid0 = isNaN(x0) || isNaN(y0)
                    const invalid1 = isNaN(x1) || isNaN(y1)
                    if (invalid0 || invalid1) continue

                    const distance = distance_to_line_segment(canvas_x, canvas_y, x0, y0, x1, y1)
                    if (distance < best_distance){
                        best_distance = distance
                        best_actor = actor_selection.actor_index
                        best_polygon = polygon_index
                        best_polygon_edge = edge_index
                    }
                }
            }
        }
        return [best_actor, best_polygon, best_polygon_edge, best_distance]
    }

    find_nearest_polygon(state: EditorState, canvas_x: number, canvas_y: number): [number, number, number] {
        const best_actor = -1
        const best_vertex = -1
        const best_distance = Number.MAX_VALUE
        // TODO
        return [best_actor, best_vertex, best_distance]
    }

    find_actors_in_box(
        map: UnrealMap,
        canvas_x0: number,
        canvas_y0: number,
        canvas_x1: number,
        canvas_y1: number,
    ): number[] {
        return []
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
            // TODO
            result.actors.push({ 
                ...DEFAULT_ACTOR_SELECTION, 
                actor_index, 
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
        let best_location: Vector = null
        let best_distance = Number.MAX_VALUE
        
        for (let i = 0; i < state.map.actors.length; i++){
            const actor_index = i
            const actor = state.map.actors[actor_index]
            const brush = actor.brushModel
            if (!brush){
                continue
            }
            for (let j = 0; j < brush.polygons.length; j++){
                const polygon_index = j
                const polygon_uv = get_brush_polygon_vertex_uvs(brush, polygon_index)

                // snap to uv vertexes
                for (const uv_vector of polygon_uv){
                    const x = this.render_transform.view_transform_x(uv_vector)
                    const y = this.render_transform.view_transform_y(uv_vector)
                    const distance = distance_2d_to_point(canvas_x, canvas_y, x, y)
                    if (distance < best_distance){
                        best_distance = distance
                        best_location = uv_vector
                    }
                }

            }
        }
        return [best_location, best_distance]
    }
    
    query_point(
        state: EditorState, 
        canvas_x: number, 
        canvas_y: number, 
        custom_geometry_cache: GeometryCache,
    ): ViewportPointQueryResult
    {
        throw new NotImplementedError()
    }
}
