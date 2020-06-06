import { UnrealMap } from "../model/UnrealMap";
import { Actor } from "../model/Actor";
import { Polygon } from "../model/Polygon";
import { IRenderer } from "./IRenderer";
import { Vector } from "../model/Vector";
import { CsgOperation } from "../model/CsgOperation";

const colors: { [key: string]: string } = {
    activeBrush: "#f12",
    addBrush: "#16c",
    subtractBrush: "#c92",
    invalidBrush: "#444",
}

function getBrushWireColor(actor: Actor): string {
    switch (actor.csgOperation) {
        case CsgOperation.Active: return colors.activeBrush;
        case CsgOperation.Add: return colors.addBrush;
        case CsgOperation.Subtract: return colors.subtractBrush;
        default: return colors.invalidBrush;
    }
}

export function createWireframeRenderer(canvas: HTMLCanvasElement): IRenderer {
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    const deviceSize = Math.min(width, height);

    function renderMap(map: UnrealMap) {
        context.fillStyle = "#000";
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
            tx -= actor.location.x;
            ty -= actor.location.y;
            tz -= actor.location.z;
            const polygons = actor.brushModel.polygons;
            context.strokeStyle = getBrushWireColor(actor);
            context.lineWidth = 1.0;
            for (const polygon of polygons) {
                renderPolygon(polygon, actor.location);
            }
            tx = save_tx, ty = save_ty, tz = save_tz;
        }
    }

    function renderPolygon(polygon: Polygon, location: Vector) {
        const last = polygon.vertexes[polygon.vertexes.length - 1];
        context.beginPath();
        const lastPosition = last;
        context.moveTo(getTransformedX(lastPosition), getTransformedY(lastPosition));
        for (const vertex of polygon.vertexes) {
            const position = vertex;
            context.lineTo(
                getTransformedX(position),
                getTransformedY(position));
        }
        context.stroke();
    }

    let tx = 0.0;
    let ty = 0.0;
    let tz = 0.0;

    let getTransformedX: (vector: Vector) => number;

    let getTransformedY: (vector: Vector) => number;

    setTopMode(1/2400);

    function setPerspectiveMode(fieldOfView: number): void {
        getTransformedX = vector => {
            let x = vector.x - tx;
            let z = vector.z - tz;
            return z < 0
                ? Number.NaN
                : (x / z + .5) * deviceSize;
        }
        getTransformedY = vector => {
            let y = vector.y - ty;
            let z = vector.z - tz;
            return z < 0
                ? Number.NaN
                : (y / z + .5) * deviceSize;
        }
    }

    function setCenterTo(location: Vector): void {
        tx = location.x;
        ty = location.y;
        tz = location.z;
    }

    function setPerspectiveRotation(euler: Vector): void {

    }

    function setTopMode(scale: number): void {
        getTransformedX = vector =>
            (vector.x - tx) * deviceSize * scale + width/2;
        getTransformedY = vector =>
            (vector.y - ty) * deviceSize * scale + height/2;
    }

    function setFrontMode(scale: number): void {
        getTransformedX = vector =>
            (vector.x - tx) * deviceSize * scale + width/2;
        getTransformedY = vector =>
            (vector.z - tz) * -1 * deviceSize * scale + height/2;
    }

    function setSideMode(scale: number): void {
        getTransformedX = vector =>
            (vector.y - ty) * deviceSize * scale + width/2;
        getTransformedY = vector =>
            (vector.z - tz) * -1 * deviceSize * scale + height/2;
    }

    const s: IRenderer = {
        render: renderMap,
        setCenterTo: setCenterTo,
        setFrontMode: setFrontMode,
        setPerspectiveMode: setPerspectiveMode,
        setSideMode: setSideMode,
        setTopMode: setTopMode,
        setPerspectiveRotation: setPerspectiveRotation
    }
    return s;
}