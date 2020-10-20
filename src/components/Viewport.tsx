import { useState } from "react";
import { IRenderer } from "../render/IRenderer";
import { createWireframeRenderer } from "../render/WireframeRenderer";
import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";
import React = require("react");
import { createController } from "../controller";
import { Rotation } from "../model/Rotation";
import { Matrix3x3 } from "../model/Matrix3x3";
import { useSignal } from "./useSignal";

export enum ViewportMode {
    Top,
    Front,
    Side,
    Perspective
}

const levelPerDouble = 8;

export const Viewport = ({
    width = 500,
    height = 300,
    controller = createController(),
    location = new Vector(0, 0, 0),
    mode = ViewportMode.Top }) => {

    const map = useSignal(controller.map);
    const vertexMode = useSignal(controller.vertexMode);

    let [canvas, setCanvas]
        = useState<HTMLCanvasElement>(null);

    let [renderer, setRenderer]
        = useState<IRenderer>(null);

    let [zoomLevel, setZoomLevel] = useState(-12 * levelPerDouble);

    const viewMode = mode;

    let [viewLocation, setViewLocation]
        = useState(location);

    let [rotation, setRotation]
        = useState(Rotation.IDENTITY);

    let [isMouseDown, setMouseDown] = useState(false);
    let [didMouseMove, setDidMouseMove] = useState(false);

    function canvasRef(attachedCanvas: HTMLCanvasElement) {
        if (attachedCanvas != null) {
            if (canvas == null || renderer == null) {
                setCanvas(attachedCanvas);
                setRenderer(createWireframeRenderer(attachedCanvas));
            }
            renderUpdate();
        }
    }

    function renderUpdate() {
        if (renderer != null) {
            const perspectiveFov = 90;
            const ortohoScale = Math.pow(2, zoomLevel/levelPerDouble);
            renderer.setShowVertexes(vertexMode);
            renderer.setCenterTo(viewLocation);
            switch (viewMode) {
                case ViewportMode.Perspective:
                    renderer.setPerspectiveRotation(rotation);
                    renderer.setPerspectiveMode(perspectiveFov);
                    break;
                case ViewportMode.Top:
                    renderer.setTopMode(ortohoScale);
                    break;
                case ViewportMode.Front:
                    renderer.setFrontMode(ortohoScale);
                    break;
                case ViewportMode.Side:
                    renderer.setSideMode(ortohoScale);
                    break;
            }
            // re-render
            renderer.render(map);
        }
    }

    const usePointerLock = false;
    const normalDragDirection = true;

    return <canvas
        width={width}
        height={height}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        ref={canvas => canvasRef(canvas)}
        style={{
            maxWidth: '100%',
            maxHeight: '100%'
        }} />;

    function onContextMenu(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();
    }

    function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
        canvas.setPointerCapture(event.pointerId);
        if (usePointerLock && canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
        setMouseDown(true);
        setDidMouseMove(false);
    }

    function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
        canvas.releasePointerCapture(event.pointerId);
        if (usePointerLock && document.exitPointerLock) {
            document.exitPointerLock();
        }
        if (!didMouseMove) {
            const canvasX = event.pageX - canvas.offsetLeft;
            const canvasY = event.pageY - canvas.offsetTop;
            if (vertexMode){
                const [actor, vertexIndex] = renderer.findNearestVertex(map, canvasX, canvasY);
                if (event.ctrlKey){
                    controller.selectToggleVertex(actor, vertexIndex);
                } else {
                    controller.selectVertex(actor, vertexIndex);
                }
            } else {
                const actor = renderer.findNearestActor(map, canvasX, canvasY);
                if (event.ctrlKey) {
                    controller.toggleSelection(actor);
                } else {
                    controller.makeSelection(actor);
                }
            }
        }
        setMouseDown(false);
    }

    function onWheel(event: React.WheelEvent){
        if (event.ctrlKey){
            setZoomLevel(zoomLevel - (event.deltaX + event.deltaY + event.deltaZ));
            event.preventDefault();
            return false;
        } 
        console.log(event, event.deltaMode, event.deltaX, event.deltaY, event.deltaZ);
    }

    function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {


        if (!isMouseDown) {
            return;
        }
        let dx = event.movementX;
        let dy = event.movementY;
        if (normalDragDirection) {
            dx *= -1;
            dy *= -1;
        }
        const ortohoScale = Math.pow(2, zoomLevel/levelPerDouble);
        const deviceSize = Math.min(width, height);
        const scale = ortohoScale * deviceSize;
        setDidMouseMove(true);
        const [nextRotation, nextLocation] =
            nextViewState(viewLocation, rotation, viewMode, dx, dy, event.buttons, deviceSize, ortohoScale);
        setViewLocation(nextLocation);
        setRotation(nextRotation);
    }

}

function nextViewState(
    location: Vector,
    rotation: Rotation,
    viewmode: ViewportMode,
    moveX: number,
    moveY: number,
    pointerButtons: number,
    deviceSize: number,
    ortohoScale: number)
    : [Rotation, Vector] {
    let nextRotation = rotation;
    let nextLocation = location;

    const leftPress = pointerButtons === 1;
    const rightPress = pointerButtons === 2;
    const bothPress = pointerButtons === 3;

    const scale = deviceSize * ortohoScale;
    const scaledX = moveX / scale;
    const scaledY = moveY / scale;
    const normX = moveX / deviceSize;
    const normY = moveY / deviceSize;

    const perspectiveRotateSpeed = 90;
    const perspectiveMoveSpeed = 1024;

    switch (viewmode) {
        case ViewportMode.Perspective:
            if (leftPress) {
                const dir = rotation.toMatrix().apply(Vector.FORWARD);
                nextLocation = location.add(dir.x * normY * perspectiveMoveSpeed, dir.y * normY * perspectiveMoveSpeed, 0);
                nextRotation = rotation.add(0, -normX * perspectiveRotateSpeed, 0);
            } else if (rightPress) {
                nextRotation = rotation.add(normY * perspectiveRotateSpeed, -normX * perspectiveRotateSpeed, 0);
            } else if (bothPress) {
                console.log('both');
                const matrix = Matrix3x3
                    .rotateDegreesZ(rotation.yaw)
                    .rotateDegreesY(rotation.pitch);
                const forward = matrix.apply(Vector.UP);
                const right = matrix.apply(Vector.RIGHT);
                nextLocation = location
                    .addVector(Vector.UP.scale(normY * perspectiveMoveSpeed))
                    .addVector(right.scale(-normX * perspectiveMoveSpeed));
            }

            break;
        case ViewportMode.Top:
            nextLocation = location.add(scaledX, scaledY, 0);
            break;
        case ViewportMode.Front:
            nextLocation = location.add(scaledX, 0, -scaledY);
            break;
        case ViewportMode.Side:
            nextLocation = location.add(0, scaledX, -scaledY);
            break;
    }
    return [nextRotation, nextLocation];
}