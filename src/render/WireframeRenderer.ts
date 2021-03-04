import { UnrealMap } from "../model/UnrealMap";
import { Actor } from "../model/Actor";
import { IRenderer } from "./IRenderer";
import { Vector } from "../model/Vector";
import { CsgOperation } from "../model/CsgOperation";
import { PolyFlags } from "../model/PolyFlags";
import { Color } from "../model/Color";
import { Rotation } from "../model/Rotation";
import { Matrix3x3 } from "../model/Matrix3x3";
import { BrushModel } from "../model/BrushModel";
import { EditorState } from "../model/EditorState";
import { BoundingBox } from "../model/BoundingBox";
import { GeometryCache } from "../model/geometry/GeometryCache";
import { distance_2d_to_point, distance_to_line_segment } from "../model/geometry/distance-functions";
import { intersect_segment_with_plane } from "../model/geometry/intersect-functions";
import { InteractionRenderState } from "../controller/interactions/InteractionRenderState";
import { ViewportMode } from "../model/ViewportMode";

const backgroundColor = '#222';


interface IBrushColors {
    activeBrush: string
    addBrush: string
    semiSolidBrush: string
    nonSolidBrush: string
    subtractBrush: string
    invalidBrush: string
}

const colors: IBrushColors = {
    activeBrush: "#c12",
    addBrush: "#27c",
    semiSolidBrush: "#6aa",
    nonSolidBrush: "#191",
    subtractBrush: "#c62",
    invalidBrush: "#444",
}

const vertexColor = colors.activeBrush;
const vertexSelectedColor = "#fff";

const selectedColors: IBrushColors = {
    activeBrush: makeSelectedColor(colors.activeBrush),
    addBrush: makeSelectedColor(colors.addBrush),
    semiSolidBrush: makeSelectedColor(colors.semiSolidBrush),
    nonSolidBrush: makeSelectedColor(colors.nonSolidBrush),
    subtractBrush: makeSelectedColor(colors.subtractBrush),
    invalidBrush: makeSelectedColor(colors.invalidBrush),
}

function get_color_based_on_poly_count(count : number){
    switch(count){
        case 0: return "#666";
        case 1: return "#8c4";
        case 2: return "#c12";
        default: return "#c19";
    }
}

function makeSelectedColor(cstr: string) {
    const colorSelected = Color.WHITE;
    return Color.fromHex(cstr).mix(colorSelected, 0.65).toHex();
}

function get_brush_wire_color(actor: Actor): string {
    const set: IBrushColors = actor.selected ? selectedColors : colors;
    switch (actor.csgOperation) {
        case CsgOperation.Active: return set.activeBrush;
        case CsgOperation.Add:
            if (actor.polyFlags & PolyFlags.NonSolid)
                return set.nonSolidBrush;
            else if (actor.polyFlags & PolyFlags.SemiSolid)
                return set.semiSolidBrush;
            else
                return set.addBrush;
        case CsgOperation.Subtract: return set.subtractBrush;
        default: return set.invalidBrush;
    }
}

export function create_wireframe_renderer(canvas: HTMLCanvasElement, geometry_cache : GeometryCache): IRenderer {
    const context = canvas.getContext("2d");
    let { width, height } = canvas;
    let deviceSize = Math.min(width, height);
    let showVertexes = false;
    let view_center : Vector = Vector.ZERO;

    let get_view_bounding_box: () => BoundingBox;
    let view_transform_x: (vector: Vector) => number;
    let view_transform_y: (vector: Vector) => number;
    let view_transform: (in_vector: Vector) => Vector;
    let canvas_to_world_location: (canvas_x: number, canvas_y: number) => Vector
    let view_rotation = Matrix3x3.IDENTITY;
    let view_mode = ViewportMode.Top;


    function render(state : EditorState) : void {
        render_map(state.map)
        render_interaction(state.interaction_render_state)
    }  

    function render_map(map: UnrealMap) {

        width = canvas.width
        height = canvas.height
        deviceSize = Math.min(width, height)

        context.fillStyle = backgroundColor
        context.fillRect(0, 0, width, height)

        if (map == null) {
            return
        }

        const view_bounding_box = get_view_bounding_box()

        for (let i=0; i<map.actors.length; i++) {
            const actor = map.actors[i]
            if (!actor.selected) { render_actor(actor, i, view_bounding_box) }
        }
        if (showVertexes){
            context.fillStyle = backgroundColor + '8'
            context.fillRect(0, 0, width, height)
        }
        for (let i=0; i<map.actors.length; i++) {
            const actor = map.actors[i]
            if (actor.selected) { render_actor(actor, i, view_bounding_box) }
        }
    }

    function render_actor(actor: Actor, index: number, view_bounding_box: BoundingBox) {
        if (actor.brushModel == null) {
            return;
        } 

        const box = geometry_cache.get_bounding_box(index);
        if (!view_bounding_box.intersects(box)){
            return;
        }

        const transformed_vertexes = geometry_cache.get_world_transformed_vertexes(index);

        context.strokeStyle = get_brush_wire_color(actor);
        context.lineWidth = 1.5;

        render_wireframe_edges(actor.brushModel, transformed_vertexes, actor.selected && showVertexes);
        if (showVertexes && actor.selected){
            render_vertexes(actor.brushModel, transformed_vertexes);
        }
    }

    function render_vertexes(brush: BrushModel, transformed_vertexes: Vector[]){
        for (let i=0; i<brush.vertexes.length; i++){
            const is_selected = brush.vertexes[i].selected;
            const point = transformed_vertexes[i];
            const x = view_transform_x(point);
            const y = view_transform_y(point);

            if (!isNaN(x) && !isNaN(y))
            {
                context.fillStyle = is_selected ? vertexSelectedColor : vertexColor;
                context.beginPath();
                context.arc(x,y,3,0,Math.PI*2);
                context.fill();
            }
        }
    }

    function render_wireframe_edges(brush: BrushModel, transformed_vertexes: Vector[], colorBasedOnPolyCount: boolean) {
        let warned_brush_edges = false;
        for (const edge of brush.edges) {
            const brushVertexA = brush.vertexes[edge.vertexIndexA];
            const brushVertexB = brush.vertexes[edge.vertexIndexB];
            if (!brushVertexA || !brushVertexB){
                if (!warned_brush_edges){
                    warned_brush_edges = true;
                    console.warn('corrupted brush edges', brush);
                }
                continue;
            }
            const vertexA = transformed_vertexes[edge.vertexIndexA];
            const vertexB = transformed_vertexes[edge.vertexIndexB];
            
            if (colorBasedOnPolyCount)
            {
                context.strokeStyle = get_color_based_on_poly_count(edge.polygons.length);
            }

            if (view_transform != null){
                let out_vertex_a = view_transform(vertexA);
                let out_vertex_b = view_transform(vertexB);
                if (out_vertex_a.x < 0 && out_vertex_b.x < 0){
                    continue;
                }
                else if (out_vertex_a.x < 0)
                {
                    out_vertex_a = intersect_segment_with_plane(out_vertex_a, out_vertex_b, Vector.FORWARD, Vector.ZERO, +0.1);
                }
                else if (out_vertex_b.x < 0){
                    out_vertex_b = intersect_segment_with_plane(out_vertex_b, out_vertex_a, Vector.FORWARD, Vector.ZERO, +0.1);
                }
                const screen_a_x = (out_vertex_a.y / out_vertex_a.x) * deviceSize + width * .5;
                const screen_a_y = (-out_vertex_a.z / out_vertex_a.x) * deviceSize + height * .5;
                const screen_b_x = (out_vertex_b.y / out_vertex_b.x) * deviceSize + width * .5;
                const screen_b_y = (-out_vertex_b.z / out_vertex_b.x) * deviceSize + height * .5;
                context.beginPath();
                context.moveTo(screen_a_x, screen_a_y);
                context.lineTo(screen_b_x, screen_b_y);
                context.stroke();
                continue;
            }

            const x0 = view_transform_x(vertexA), y0 = view_transform_y(vertexA);
            const x1 = view_transform_x(vertexB), y1 = view_transform_y(vertexB);
            const invalid0 = isNaN(x0) || isNaN(y0);
            const invalid1 = isNaN(x1) || isNaN(y1);

            
            if (!invalid0 && !invalid1)
            {
                context.beginPath();
                context.moveTo(x0,y0);
                context.lineTo(x1,y1);
                context.stroke();
            }
            else if(!invalid0 && invalid1 || invalid0 && !invalid1)
            {
                // need view transformed Z for clipping
                let v0 = invalid1 ? vertexA : vertexB;
                let v1 = invalid1 ? vertexB : vertexA;
                let vi = intersect_segment_with_plane(v0, v1, Vector.FORWARD, Vector.ZERO, -0.1);
                if (vi != null){
                    const x0 = view_transform_x(v0), y0 = view_transform_y(v0);
                    const x1 = view_transform_x(vi), y1 = view_transform_y(vi);
                    context.beginPath();
                    context.moveTo(x0,y0);
                    context.lineTo(x1,y1);
                    context.stroke();
                }
            }
        }
    }

    function 
    render_interaction(state: InteractionRenderState){
        if (!state){
            return
        }

        if (state.line_from && state.line_to){
            const vertexA = state.line_from
            const vertexB = state.line_to
    
            const x0 = view_transform_x(vertexA), y0 = view_transform_y(vertexA)
            const x1 = view_transform_x(vertexB), y1 = view_transform_y(vertexB)
            const invalid0 = isNaN(x0) || isNaN(y0)
            const invalid1 = isNaN(x1) || isNaN(y1)
    
            if (!invalid0 && !invalid1)
            {
                context.strokeStyle = '#fff'
                const dx = x1-x0, dy = y1-y0
                const len = Math.sqrt(dx*dx + dy*dy)
                const nx = dx/len, ny = dy/len
                const rx = ny, ry = -nx
                context.beginPath()
                // line
                context.moveTo(x0,y0)
                context.lineTo(x1,y1)
                // tail
                context.moveTo(x0 - rx*2, y0 - ry*2)
                context.lineTo(x0 + rx*2, y0 + ry*2)
                // arrowhead
                context.moveTo(x1 + 6*(-rx-nx), y1 + 6*(-ry-ny))
                context.lineTo(x1, y1)
                context.lineTo(x1 + 6*(+rx-nx), y1 + 6*(+ry-ny))
                context.stroke()

            }
        }

        if (state.snap_location){
            const x = view_transform_x(state.snap_location)
            const y = view_transform_y(state.snap_location)

            
            if (!isNaN(x) && !isNaN(y)){
                context.strokeStyle = '#fff'
                context.beginPath()
                context.rect(x-2,y-2,5,5)
                context.stroke()
            }
        }
    }

    set_top_mode(1 / 2400);

    function set_perspective_mode(field_of_view: number): void {

        view_mode = ViewportMode.Perspective

        get_view_bounding_box = () => {
            const forward = view_rotation.apply(Vector.FORWARD);

            let max_squared = 0;
            let axis = 0;
            for (let i=0; i<3; i++){
                let component = forward.get_component(i);
                let squared = component * component;
                if (squared > max_squared){
                    max_squared = squared;
                    axis = i;
                }
            }

            let negative = forward.get_component(axis) < 0;

            switch (axis){
                case 0 :
                    return negative 
                        ? new BoundingBox({ max_x: view_center.x })
                        : new BoundingBox({ min_x: view_center.x })
                case 1 :
                    return negative 
                        ? new BoundingBox({ min_y: view_center.y })
                        : new BoundingBox({ max_y: view_center.y })
                case 2 :
                    return negative 
                        ? new BoundingBox({ max_z: view_center.z })
                        : new BoundingBox({ min_z: view_center.z })
                default: 
                    throw new Error('implementation error');
            }
        }
        view_transform = (i) => {
            const x = i.x - view_center.x;
            const y = i.y - view_center.y;
            const z = i.z - view_center.z;
            return new Vector(
                view_rotation.getTransformedX(x, y, z),
                view_rotation.getTransformedY(x, y, z),
                view_rotation.getTransformedZ(x, y, z))
        }
        view_transform_x = v => {
            const w_x = v.x - view_center.x;
            const w_y = v.y - view_center.y;
            const w_z = v.z - view_center.z;
            const x = view_rotation.getTransformedX(w_x, w_y, w_z);
            const y = view_rotation.getTransformedY(w_x, w_y, w_z);
            return x < 0
                ? Number.NaN
                : (y / x) * deviceSize + width * .5;
        }
        view_transform_y = v => {
            const w_x = v.x - view_center.x;
            const w_y = v.y - view_center.y;
            const w_z = v.z - view_center.z;
            const x = view_rotation.getTransformedX(w_x, w_y, w_z);
            const z = view_rotation.getTransformedZ(w_x, w_y, w_z);
            return x < 0
                ? Number.NaN
                : (-z / x) * deviceSize + height * .5;
        }
        canvas_to_world_location = (x,y) => {
            return Vector.ZERO
        }
    }

    function setCenterTo(location: Vector): void {
        view_center = location;
    }

    function setPerspectiveRotation(rotation: Rotation): void {
        view_rotation = Matrix3x3
            .rotateDegreesY(-rotation.pitch)
            .rotateDegreesZ(-rotation.yaw);
    }

    function set_top_mode(scale: number): void { 
        view_mode = ViewportMode.Top
        get_view_bounding_box = () => {
            const x_size = width / 2 / deviceSize / scale;
            const y_size = height / 2 / deviceSize / scale;
            return new BoundingBox({
                min_x: view_center.x - x_size, max_x: view_center.x + x_size,
                min_y: view_center.y - y_size, max_y: view_center.y + y_size
            })
        }
        view_transform = null,
        view_transform_x = vector =>
            (vector.x - view_center.x) * deviceSize * scale + width / 2;
        view_transform_y = vector =>
            (vector.y - view_center.y) * deviceSize * scale + height / 2;
        canvas_to_world_location = (x,y) => 
            new Vector(
                view_center.x + (x - width/2) / deviceSize / scale,
                view_center.y + (y - height/2) / deviceSize / scale,
                view_center.z)
        
    }

    function set_front_mode(scale: number): void {
        view_mode = ViewportMode.Front
        get_view_bounding_box = () => {
            const y_size = width / 2 / deviceSize / scale
            const z_size = height / 2 / deviceSize / scale
            return new BoundingBox({
                min_y: view_center.y - y_size, max_y: view_center.y + y_size,
                min_z: view_center.z - z_size, max_z: view_center.z + z_size
            })
        }
        view_transform_x = vector =>
            (vector.y - view_center.y) * deviceSize * scale + width / 2;
        view_transform_y = vector =>
            (vector.z - view_center.z) * -1 * deviceSize * scale + height / 2;
        canvas_to_world_location = (x,y) => new Vector(
            view_center.x,
            view_center.y + (x - width/2) / deviceSize / scale,
            view_center.z - (y - height/2) / deviceSize / scale)
    }

    function set_side_mode(scale: number): void {
        view_mode = ViewportMode.Side
        get_view_bounding_box = () => {
            const x_size = width / 2 / deviceSize / scale
            const z_size = height / 2 / deviceSize / scale
            return new BoundingBox({
                min_x: view_center.x - x_size, max_x: view_center.x + x_size,
                min_z: view_center.z - z_size, max_z: view_center.z + z_size
            })
        }
        view_transform = null,
        view_transform_x = vector =>
            (vector.x - view_center.x) * deviceSize * scale + width / 2;
        view_transform_y = vector =>
            (vector.z - view_center.z) * -1 * deviceSize * scale + height / 2;
        canvas_to_world_location = (x,y) => new Vector(
            view_center.x + (x - width/2) / deviceSize / scale,
            view_center.y,
            view_center.z - (y - height/2) / deviceSize / scale)
    }

    function findNearestActor(
        map: UnrealMap,
        canvasX: number,
        canvasY: number
    ) {
        const MAX_DISTANCE = 8;
        let bestMatch: Actor = null;
        let bestDistance = Number.MAX_VALUE;
        for (let actor_index=map.actors.length-1; actor_index >= 0; actor_index--) {
            const actor = map.actors[actor_index]; // reverse iterate to find topmost actor
            if (actor.brushModel != null) {

                const vertexes = geometry_cache.get_world_transformed_vertexes(actor_index);

                for (const edge of actor.brushModel.edges) {
                    let p0 = vertexes[edge.vertexIndexA];
                    let x0 = view_transform_x(p0);
                    let y0 = view_transform_y(p0);
                    const p1 = vertexes[edge.vertexIndexB];
                    let x1 = view_transform_x(p1);
                    let y1 = view_transform_y(p1);
                    if (!isNaN(x0) && !isNaN(x1)) {
                        let distance = distance_to_line_segment(canvasX, canvasY, x0, y0, x1, y1);
                        if (distance < bestDistance) {
                            bestMatch = actor;
                            bestDistance = distance;
                        }
                    }
                }
            }
        }
        if (bestDistance > MAX_DISTANCE) {
            bestMatch = null; // to far away
        }
        return bestMatch;
    }

    function findNearestVertex(
        map: UnrealMap,
        canvasX: number,
        canvasY: number):[
            Actor, number
        ]
    {
        const MAX_DISTANCE = 8;
        let bestMatchActor: Actor = null;
        let bestMatchVertex = -1;
        let bestDistance = Number.MAX_VALUE;
        for (let actor_index=map.actors.length-1; actor_index >= 0; actor_index--) {
            const actor = map.actors[actor_index]; // reverse iterate to find topmost actor
            if (!actor.selected || actor.brushModel == null){
                continue; // skip actors which are not selected or don't have a brushModel
            }

            const transformed_vertexes = geometry_cache.get_world_transformed_vertexes(actor_index)
            const vertexes = actor.brushModel.vertexes;

            for (let vertex_index = vertexes.length-1; vertex_index >= 0; vertex_index--) {
                let p0 = transformed_vertexes[vertex_index];
                let x0 = view_transform_x(p0);
                let y0 = view_transform_y(p0);
                if (!isNaN(x0) && !isNaN(y0)) {
                    let distance = distance_2d_to_point(canvasX, canvasY, x0, y0);
                    if (distance < bestDistance) {
                        bestMatchActor = actor;
                        bestMatchVertex = vertex_index;
                        bestDistance = distance;
                    }
                }
            }
        }
        if (bestDistance > MAX_DISTANCE){
            bestMatchActor = null;
            bestMatchVertex = -1;
        }
        return [bestMatchActor, bestMatchVertex];
    }

    function find_nearest_snapping_point(
        map: UnrealMap,
        canvas_x: number,
        canvas_y: number,
        custom_geometry_cache: GeometryCache):[
            Vector, number
        ]
    {
        let bestMatchLocation : Vector = null
        let bestDistance = Number.MAX_VALUE
        for (let actor_index=map.actors.length-1; actor_index >= 0; actor_index--) {
            const actor = map.actors[actor_index] // reverse iterate to find topmost actor
            if (actor.brushModel == null){
                continue // skip actors don't have a brushModel
            }

            const world_vertexes = custom_geometry_cache.get_world_transformed_vertexes(actor_index)

            for (const vertex of world_vertexes) {
                const x0 = view_transform_x(vertex)
                const y0 = view_transform_y(vertex)
                if (!isNaN(x0) && !isNaN(y0)) {
                    const distance = distance_2d_to_point(canvas_x, canvas_y, x0, y0)
                    if (distance < bestDistance) {
                        bestMatchLocation = vertex
                        bestDistance = distance
                    }
                }
            }
        }
        return [bestMatchLocation, bestDistance]
    }

    const s: IRenderer = {
        render: render_map,
        render_v2: render,
        setCenterTo,
        setFrontMode: set_front_mode,
        setPerspectiveMode: set_perspective_mode,
        setSideMode: set_side_mode,
        setTopMode: set_top_mode,
        get_view_mode: () => view_mode,
        setPerspectiveRotation,
        findNearestActor,
        findNearestVertex,
        find_nearest_snapping_point,
        get_pointer_world_location: (x,y) => canvas_to_world_location(x,y),
        setShowVertexes: (state:boolean) => { showVertexes = state; } 
    }
    return s;
}
