import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";
import { Actor } from "../model/Actor";
import { Rotation } from "../model/Rotation";
import { EditorState } from "../model/EditorState";
import { GeometryCache } from "../model/geometry/GeometryCache";
import { ViewportMode } from "../model/ViewportMode";

export interface Renderer {
    set_show_vertexes(state: boolean) : void;
    set_center_to(location : Vector) : void;
    set_perspective_rotation(rotation : Rotation) : void;
    set_perspective_mode(fieldOfView : number) : void;
    set_top_mode(scale : number) : void;
    set_front_mode(scale : number) : void;
    set_side_mode(scale : number) : void;
    set_uv_mode(scale : number) : void;
    get_view_mode() : ViewportMode;
    /** @deprecated use render_v2 */
    render (unrealMap : UnrealMap) : void;
    render_v2 (state : EditorState) : void;
    find_nearest_actor(map: UnrealMap, canvasX: number, canvasY: number) : Actor;
    find_nearest_vertex(map: UnrealMap, canvasX: number, canvasY: number): [Actor, number];
    find_nearest_snapping_point(map: UnrealMap,canvasX: number,canvasY: number, geometry_cache: GeometryCache): [Vector, number]
    get_pointer_world_location(canvas_x: number, canvas_y: number): Vector;
}