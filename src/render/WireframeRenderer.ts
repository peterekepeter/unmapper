import { UnrealMap } from "../model/UnrealMap";
import { Actor } from "../model/Actor";
import { Polygon } from "../model/Polygon";
import { IRenderer } from "./IRenderer";
import { Vector } from "../model/Vector";
import { CsgOperation } from "../model/CsgOperation";
import { PolyFlags } from "../model/PolyFlags";
import { Color } from "../model/Color";
import { Rotation } from "../model/Rotation";
import { Matrix3x3 } from "../model/Matrix3x3";

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

const selectedColors: IBrushColors = {
    activeBrush: makeSelectedColor(colors.activeBrush),
    addBrush: makeSelectedColor(colors.addBrush),
    semiSolidBrush: makeSelectedColor(colors.semiSolidBrush),
    nonSolidBrush: makeSelectedColor(colors.nonSolidBrush),
    subtractBrush: makeSelectedColor(colors.subtractBrush),
    invalidBrush: makeSelectedColor(colors.invalidBrush),
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

export function createWireframeRenderer(canvas: HTMLCanvasElement): IRenderer {
    const context = canvas.getContext("2d");
    let { width, height } = canvas;
    let deviceSize = Math.min(width, height);

    function renderMap(map: UnrealMap) {

        width = canvas.width;
        height = canvas.height;
        deviceSize = Math.min(width, height);

        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);

        if (map == null) {
            return;
        }

        for (const actor of map.actors) {
            renderActor(actor);
        }
    }

    function renderActor(actor: Actor) {
        if (actor.brushModel != null) { 
            let save_tx = tx, save_ty = ty, save_tz = tz;
            if (actor.prePivot){
                tpx = -actor.prePivot.x;
                tpy = -actor.prePivot.y;
                tpz = -actor.prePivot.z;
            } else {
                tpx = tpy = tpz = 0;
            }
            tx += actor.location.x;
            ty += actor.location.y;
            tz += actor.location.z;
            const rot = new Rotation(-actor.rotation.pitch, -actor.rotation.yaw, -actor.rotation.roll)
            const matrix = actor.postScale.toMatrix()
                .multiply(actor.rotation.toMatrix())
                .multiply(actor.mainScale.toMatrix());
            objectMatrix = matrix;
            const polygons = actor.brushModel.polygons;
            context.strokeStyle = getBrushWireColor(actor);
            context.lineWidth = 1.0;
            for (const polygon of polygons) {
                renderPolygon(polygon);
            }
            tx = save_tx, ty = save_ty, tz = save_tz;
        }
    }

    function renderPolygon(polygon: Polygon) {
        const last = polygon.vertexes[polygon.vertexes.length - 1];
        context.beginPath();
        const lastPosition = objectTransform(last);
        context.moveTo(viewTransformX(lastPosition), viewTransformY(lastPosition));
        for (const vertex of polygon.vertexes) {
            const position = objectTransform(vertex);
            context.lineTo(
                viewTransformX(position),
                viewTransformY(position));
        }
        context.stroke();
    }

    let tx = 0.0, tpx = 0.0;
    let ty = 0.0, tpy = 0.0;
    let tz = 0.0, tpz = 0.0;
    let objectMatrix = Matrix3x3.IDENTITY;

    function objectTransform(vector : Vector) : Vector {
        return objectMatrix
            .apply(vector.add(tpx, tpy, tpz))
            .add(tx,ty,tz);
    }

    let viewTransformX: (vector: Vector) => number;

    let viewTransformY: (vector: Vector) => number;
    let perspectiveMatrix = Matrix3x3.IDENTITY;

    setTopMode(1 / 2400);

    function setPerspectiveMode(fieldOfView: number): void {
        viewTransformX = v => {
            const x = perspectiveMatrix.getTransformedX(v.x, v.y, v.z);
            const y = perspectiveMatrix.getTransformedY(v.x, v.y, v.z);
            return x < 0
                ? Number.NaN
                : (y / x) * deviceSize + width * .5;
        }
        viewTransformY = v => {
            const x = perspectiveMatrix.getTransformedX(v.x, v.y, v.z);
            const z = perspectiveMatrix.getTransformedZ(v.x, v.y, v.z);
            return x < 0
                ? Number.NaN
                : (-z / x) * deviceSize + height * .5;
        }
    }

    function setCenterTo(location: Vector): void {
        tx = -location.x;
        ty = -location.y;
        tz = -location.z;
    }

    function setPerspectiveRotation(rotation: Rotation): void {
        perspectiveMatrix = Matrix3x3
            .rotateDegreesY(-rotation.pitch)
            .rotateDegreesZ(-rotation.yaw);
    }

    function setTopMode(scale: number): void {
        viewTransformX = vector =>
            vector.x * deviceSize * scale + width / 2;
        viewTransformY = vector =>
            vector.y * deviceSize * scale + height / 2;
    }

    function setFrontMode(scale: number): void {
        viewTransformX = vector =>
            vector.x * deviceSize * scale + width / 2;
        viewTransformY = vector =>
            vector.z * -1 * deviceSize * scale + height / 2;
    }

    function setSideMode(scale: number): void {
        viewTransformX = vector =>
            vector.y * deviceSize * scale + width / 2;
        viewTransformY = vector =>
            vector.z * -1 * deviceSize * scale + height / 2;
    }

    function findNearestActor(
        map: UnrealMap,
        canvasX: number,
        canvasY: number
    ) {
        const MAX_DISTANCE = 8;
        let bestMatch: Actor = null;
        let bestDistance = Number.MAX_VALUE;
        for (const actor of map.actors) {
            if (actor.brushModel != null) {
                const matrix = actor.mainScale.toMatrix()
                    .multiply(actor.rotation.toMatrix())
                    .multiply(actor.postScale.toMatrix());
                objectMatrix = matrix;
                if (actor.prePivot){
                    tpx = -actor.prePivot.x;
                    tpy = -actor.prePivot.y;
                    tpz = -actor.prePivot.z;
                } else {
                    tpx = tpy = tpz = 0;
                }
                let save_tx = tx, save_ty = ty, save_tz = tz;
                tx += actor.location.x;
                ty += actor.location.y;
                tz += actor.location.z;
                const polygons = actor.brushModel.polygons;
                for (const polygon of polygons) {
                    let last = objectTransform(polygon.vertexes[polygon.vertexes.length - 1]);
                    let x0 = viewTransformX(last);
                    let y0 = viewTransformY(last);
                    for (const v of polygon.vertexes) {
                        const vertex = objectTransform(v);
                        let x1 = viewTransformX(vertex);
                        let y1 = viewTransformY(vertex);
                        if (!isNaN(x0) && !isNaN(x1)) {
                            let distance = distanceToLineSegment(canvasX, canvasY, x0, y0, x1, y1);
                            if (distance < bestDistance) {
                                bestMatch = actor;
                                bestDistance = distance;
                            }
                        }
                        x0 = x1;
                        y0 = y1;
                    }
                }
                tx = save_tx, ty = save_ty, tz = save_tz;
            }
        }
        if (bestDistance > MAX_DISTANCE) {
            bestMatch = null; // to far away
        }
        console.log(bestMatch);
        return bestMatch;
    }

    const s: IRenderer = {
        render: renderMap,
        setCenterTo: setCenterTo,
        setFrontMode: setFrontMode,
        setPerspectiveMode: setPerspectiveMode,
        setSideMode: setSideMode,
        setTopMode: setTopMode,
        setPerspectiveRotation: setPerspectiveRotation,
        findNearestActor: findNearestActor
    }
    return s;
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