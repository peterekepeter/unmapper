import { Actor } from "../../model/Actor"
import { EditorSelection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { GeometryCache } from "../../model/geometry/GeometryCache"
import { UnrealMap } from "../../model/UnrealMap"
import { Vector } from "../../model/Vector"
import { ViewportMode } from "../../model/ViewportMode"
import { ViewTransform } from "../ViewTransform"
import { UvViewportQueries } from "./UvViewportQueries"
import { WorldViewportQueries } from "./WorldViewportQueries"

export class AllViewportQueries {

    public mode: ViewportMode;
    private world_queries: WorldViewportQueries
    private uv_queries: UvViewportQueries

    constructor(private geometry_cache: GeometryCache) { 
        this.world_queries = new WorldViewportQueries(geometry_cache)
        this.uv_queries = new UvViewportQueries()
    }

    set render_transform(transform: ViewTransform) {
        this.uv_queries.render_transform = transform
        this.world_queries.render_transform = transform
    }
    
    private get use_uv_queries() : boolean {
        return this.mode === ViewportMode.UV
    }

    private get current() : WorldViewportQueries | UvViewportQueries {
        return this.use_uv_queries ? this.uv_queries : this.world_queries
    }

    find_nearest_actor(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number,
    ): Actor {
        return this.current.find_nearest_actor(map, canvas_x, canvas_y)
    }

    find_selection_at_point(
        state: EditorState,
        canvas_x: number,
        canvas_y: number,
    ): EditorSelection {
        return this.current.find_selection_at_point(state, canvas_x, canvas_y)
    }
    
    find_actors_in_box(
        map: UnrealMap,
        canvas_x0: number,
        canvas_y0: number,
        canvas_x1: number,
        canvas_y1: number,
    ): number[] {
        return this.current.find_actors_in_box(map, canvas_x0, canvas_y0, canvas_x1, canvas_y1)
    }

    find_vertexes_of_selected_actors_in_box(
        state: EditorState,
        canvas_x0: number,
        canvas_y0: number,
        canvas_x1: number,
        canvas_y1: number,
        custom_geometry_cache: GeometryCache,
    ): EditorSelection {
        return this.current.find_vertexes_of_selected_actors_in_box(state, canvas_x0, canvas_y0, canvas_x1, canvas_y1, custom_geometry_cache)
    }

    find_nearest_snapping_point(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number,
        custom_geometry_cache: GeometryCache,
    ): [
            Vector, number,
        ] {
        return this.current.find_nearest_snapping_point(map, canvas_x, canvas_y, custom_geometry_cache)
    }
}
