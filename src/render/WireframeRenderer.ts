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
        default: case 2: return "#c19";
    }
}

function makeSelectedColor(cstr: string) {
    const colorSelected = Color.WHITE;
    return Color.fromHex(cstr).mix(colorSelected, 0.65).toHex();
}

function getBrushWireColor(actor: Actor): string {
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

interface ActorRenderMemo
{
    world_vertexes : Vector[]
}

export function create_wireframe_renderer(canvas: HTMLCanvasElement): IRenderer {
    const context = canvas.getContext("2d");
    let { width, height } = canvas;
    let deviceSize = Math.min(width, height);
    let showVertexes = false;
    let actor_memo : ActorRenderMemo[] = [];
    let prev_actor_list : Actor[] = null;
    let view_center : Vector = Vector.ZERO;

    function render(state : EditorState) : void {
        render_map(state.map);
    }  

    function render_map(map: UnrealMap) {

        width = canvas.width;
        height = canvas.height;
        deviceSize = Math.min(width, height);

        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);

        if (map == null) {
            return;
        }

        for (let i=0; i<map.actors.length; i++) {
            const actor = map.actors[i];
            if (!actor.selected) { render_actor(actor, get_actor_memo(actor, i)); }
        }
        if (showVertexes){
            context.fillStyle = backgroundColor + '8';
            context.fillRect(0, 0, width, height);
        }
        for (let i=0; i<map.actors.length; i++) {
            const actor = map.actors[i];
            if (actor.selected) { render_actor(actor, get_actor_memo(actor, i)); }
        }

        prev_actor_list = map.actors;
    }

    function get_actor_memo(actor: Actor, actor_index: number){
        if (prev_actor_list && prev_actor_list[actor_index] === actor){
            return actor_memo[actor_index];
        }
        const new_memo : ActorRenderMemo = {
            world_vertexes: null
        };
        actor_memo[actor_index] = new_memo;
        return new_memo;
    }

    function get_world_transformed_vertexes(actor: Actor, memo: ActorRenderMemo){
        if (memo.world_vertexes){
            return memo.world_vertexes; // cached ;)
        }
        
        const object_matrix = actor.postScale.toMatrix()
            .multiply(actor.rotation.toMatrix())
            .multiply(actor.mainScale.toMatrix());

        const transformed = actor.brushModel.vertexes.map(
            vertex => object_transform(object_matrix, vertex.position, actor.prePivot || Vector.ZERO, actor.location));
           
        memo.world_vertexes = transformed;
        return transformed;
    }
    
    function object_transform(matrix: Matrix3x3, vector : Vector, pivot: Vector, location: Vector) : Vector {
        if (!pivot) pivot = Vector.ZERO;
        if (!location) location = Vector.ZERO;
        return matrix
            .apply(vector.subtractVector(pivot))
            .addVector(location);
    }

    function render_actor(actor: Actor, memo: ActorRenderMemo) {
        if (actor.brushModel != null) { 

            const transformed_vertexes = get_world_transformed_vertexes(actor, memo);

            context.strokeStyle = getBrushWireColor(actor);
            context.lineWidth = 1.5;

            render_wireframe_edges(actor.brushModel, transformed_vertexes, actor.selected && showVertexes);
            if (showVertexes && actor.selected){
                render_vertexes(actor.brushModel, transformed_vertexes);
            }
        }
    }

    function render_vertexes(brush: BrushModel, transformed_vertexes: Vector[]){
        for (let i=0; i<brush.vertexes.length; i++){
            const is_selected = brush.vertexes[i].selected;
            const point = transformed_vertexes[i];
            const x = viewTransformX(point);
            const y = viewTransformY(point);

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

            const x0 = viewTransformX(vertexA), y0 = viewTransformY(vertexA);
            const x1 = viewTransformX(vertexB), y1 = viewTransformY(vertexB);
            const invalid0 = isNaN(x0) || isNaN(y0);
            const invalid1 = isNaN(x1) || isNaN(y1);

            if (colorBasedOnPolyCount)
            {
                context.strokeStyle = get_color_based_on_poly_count(edge.polygons.length);
            }
            
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
                let vi = intersectSegmentWithPlane(v0, v1, Vector.FORWARD, Vector.ZERO, -0.1);
                if (vi != null){
                    const x0 = viewTransformX(v0), y0 = viewTransformY(v0);
                    const x1 = viewTransformX(vi), y1 = viewTransformY(vi);
                    context.beginPath();
                    context.moveTo(x0,y0);
                    context.lineTo(x1,y1);
                    context.stroke();
                }
            }
        }
    }

    let viewTransformX: (vector: Vector) => number;

    let viewTransformY: (vector: Vector) => number;
    let perspectiveMatrix = Matrix3x3.IDENTITY;

    setTopMode(1 / 2400);

    function setPerspectiveMode(fieldOfView: number): void {
        viewTransformX = v => {
            const w_x = v.x - view_center.x;
            const w_y = v.y - view_center.y;
            const w_z = v.z - view_center.z;
            const x = perspectiveMatrix.getTransformedX(w_x, w_y, w_z);
            const y = perspectiveMatrix.getTransformedY(w_x, w_y, w_z);
            return x < 0
                ? Number.NaN
                : (y / x) * deviceSize + width * .5;
        }
        viewTransformY = v => {
            const w_x = v.x - view_center.x;
            const w_y = v.y - view_center.y;
            const w_z = v.z - view_center.z;
            const x = perspectiveMatrix.getTransformedX(w_x, w_y, w_z);
            const z = perspectiveMatrix.getTransformedZ(w_x, w_y, w_z);
            return x < 0
                ? Number.NaN
                : (-z / x) * deviceSize + height * .5;
        }
    }

    function setCenterTo(location: Vector): void {
        view_center = location;
    }

    function setPerspectiveRotation(rotation: Rotation): void {
        perspectiveMatrix = Matrix3x3
            .rotateDegreesY(-rotation.pitch)
            .rotateDegreesZ(-rotation.yaw);
    }

    function setTopMode(scale: number): void {
        viewTransformX = vector =>
            (vector.x - view_center.x) * deviceSize * scale + width / 2;
        viewTransformY = vector =>
            (vector.y - view_center.y) * deviceSize * scale + height / 2;
    }

    function setFrontMode(scale: number): void {
        viewTransformX = vector =>
            (vector.x - view_center.x) * deviceSize * scale + width / 2;
        viewTransformY = vector =>
            (vector.z - view_center.z) * -1 * deviceSize * scale + height / 2;
    }

    function setSideMode(scale: number): void {
        viewTransformX = vector =>
            (vector.y - view_center.y) * deviceSize * scale + width / 2;
        viewTransformY = vector =>
            (vector.z - view_center.z) * -1 * deviceSize * scale + height / 2;
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

                const vertexes = get_world_transformed_vertexes(actor, get_actor_memo(actor, actor_index));

                for (const edge of actor.brushModel.edges) {
                    let p0 = vertexes[edge.vertexIndexA];
                    let x0 = viewTransformX(p0);
                    let y0 = viewTransformY(p0);
                    const p1 = vertexes[edge.vertexIndexB];
                    let x1 = viewTransformX(p1);
                    let y1 = viewTransformY(p1);
                    if (!isNaN(x0) && !isNaN(x1)) {
                        let distance = distanceToLineSegment(canvasX, canvasY, x0, y0, x1, y1);
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
        let bestMatchVertex: number = -1;
        let bestDistance = Number.MAX_VALUE;
        for (let actorIndex=map.actors.length-1; actorIndex >= 0; actorIndex--) {
            const actor = map.actors[actorIndex]; // reverse iterate to find topmost actor
            if (!actor.selected || actor.brushModel == null){
                continue; // skip actors which are not selected or don't have a brushModel
            }

            const transformed_vertexes = get_world_transformed_vertexes(actor, get_actor_memo(actor, actorIndex));
            const vertexes = actor.brushModel.vertexes;

            for (let vertex_index = vertexes.length-1; vertex_index >= 0; vertex_index--) {
                let p0 = transformed_vertexes[vertex_index];
                let x0 = viewTransformX(p0);
                let y0 = viewTransformY(p0);
                if (!isNaN(x0) && !isNaN(y0)) {
                    let distance = distance2dToPoint(canvasX, canvasY, x0, y0);
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

    const s: IRenderer = {
        render: render_map,
        render_v2: render,
        setCenterTo: setCenterTo,
        setFrontMode: setFrontMode,
        setPerspectiveMode: setPerspectiveMode,
        setSideMode: setSideMode,
        setTopMode: setTopMode,
        setPerspectiveRotation: setPerspectiveRotation,
        findNearestActor: findNearestActor,
        findNearestVertex: findNearestVertex,
        setShowVertexes: (state:boolean) => { showVertexes = state; } 
    }
    return s;
}

function distance2dToPoint(x0: number, y0: number, x1: number, y1: number){
    const dx = x1 - x0
    const dy = y1 - y0;
    const distance = Math.sqrt(dx*dx + dy*dy);
    return distance;
}

function distanceToPoint(from : Vector, to : Vector){
    const dx = to.x-from.x;
    const dy = to.y-from.y;
    const dz = to.z-from.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    return distance;
}

function distanceToLineSegment(
    px: number, py: number,
    ax: number, ay: number,
    bx: number, by: number): number {
    let pax = px - ax, pay = py - ay;
    let bax = bx - ax, bay = by - ay;
    let h = Math.min(1.0, Math.max(0.0,
        (pax * bax + pay * bay) / (bax * bax + bay * bay)));
    let dx = pax - bax * h;
    let dy = pay - bay * h;
    return Math.sqrt(dx * dx + dy * dy);
}

function intersectSegmentWithPlane(s0 : Vector, s1: Vector, planeNormal: Vector, planePoint: Vector, projectionBias = 0) : Vector | null {
    const sdx = s1.x - s0.x, sdy = s1.y - s0.y, sdz = s1.z - s0.z;
    const slength = Math.sqrt(sdx*sdx + sdy*sdy + sdz*sdz);
    const sdirx = sdx / slength, sdiry = sdy / slength, sdirz = sdz / slength;
    const sdirDotPlaneNormal = sdirx * planeNormal.x + sdiry * planeNormal.y + sdirz * planeNormal.z;
    if (sdirDotPlaneNormal == 0)
    {
        // line is parallel to plane
        return null;
    }
    const tx = planePoint.x - s0.x, ty = planePoint.y - s0.y, tz = planePoint.z - s0.z;
    const pointDtoPlaneNormal = tx * planeNormal.x + ty * planeNormal.y + tz * planeNormal.z;
    const distance = pointDtoPlaneNormal/sdirDotPlaneNormal;
    if (distance < 0 || distance > slength)
    {
        // intersection is outside of segment
        return null;
    }
    const pd = distance + projectionBias;
    const ix = s0.x + sdirx * pd, iy = s0.y + sdiry * pd, iz = s0.z + sdirz * pd;
    return new Vector(ix,iy,iz);
}