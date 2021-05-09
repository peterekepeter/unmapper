import { UnrealMap } from "../model/UnrealMap"
import { Vector } from "../model/Vector"
import { Actor } from "../model/Actor"
import { EditorState } from "../model/EditorState"
import { GeometryCache } from "../model/geometry/GeometryCache"
import { ViewportMode } from "../model/ViewportMode"
import { ViewTransform } from "./ViewTransform"

export interface Renderer {
    set_view_transform(view_transform: ViewTransform): void;
    set_view_mode(mode : ViewportMode) : void;
    get_view_mode(): ViewportMode;
    set_show_vertexes(state: boolean) : void;
    render_v2 (state : EditorState) : void;
    find_nearest_actor(map: UnrealMap, canvasX: number, canvasY: number) : Actor;
    find_nearest_vertex(map: UnrealMap, canvasX: number, canvasY: number): [Actor, number];
    find_nearest_snapping_point(map: UnrealMap,canvasX: number,canvasY: number, geometry_cache: GeometryCache): [Vector, number]
    get_pointer_world_location(canvas_x: number, canvas_y: number): Vector;
}