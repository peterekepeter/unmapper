import { useState } from "react";
import { IRenderer } from "../render/IRenderer";
import { createWireframeRenderer } from "../render/WireframeRenderer";
import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";
import React = require("react");
import { createController } from "../controller";
import { Rotation } from "../model/Rotation";
import { Matrix3x3 } from "../model/Matrix3x3";

export enum ViewportMode {
    Top,
    Front,
    Side,
    Perspective
}

export const Viewport = ({
    width = 500,
    height = 300,
    controller = createController(),
    location = new Vector(0, 0, 0),
    mode = ViewportMode.Top }) => {

    const map = controller.map.value;

    let [canvas, setCanvas]
        = useState<HTMLCanvasElement>(null);

    let [renderer, setRenderer]
        = useState<IRenderer>(null);

    let [viewMode, setViewMode]
        = useState(mode);

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
            const ortohoScale = 1 / 4096 /2;
            const perspectiveFov = 90;
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
            const actor = renderer.findNearestActor(map, canvasX, canvasY);
            if (event.ctrlKey) {
                controller.toggleSelection(actor);
            } else {
                controller.makeSelection(actor);
            }
        }
        setMouseDown(false);
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
        setDidMouseMove(true);
        const [nextRotation, nextLocation] =
            nextViewState(viewLocation, rotation, viewMode, dx, dy, event.buttons);
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
    pointerButtons: number)
    : [Rotation, Vector] {
    let nextRotation = rotation;
    let nextLocation = location;

    const leftPress = pointerButtons === 1;
    const rightPress = pointerButtons === 2;
    const bothPress = pointerButtons === 3;

    switch (viewmode) {
        case ViewportMode.Perspective:
            if (leftPress) {
                const dir = rotation.toMatrix().apply(Vector.FORWARD);
                nextLocation = location.add(dir.x * moveY, dir.y * moveY, 0);
                nextRotation = rotation.add(0, -moveX / 10, 0);
            } else if (rightPress) {
                nextRotation = rotation.add(moveY / 10, -moveX / 10, 0);
            } else if (bothPress) {
                const matrix = Matrix3x3
                    .rotateDegreesZ(rotation.yaw)
                    .rotateDegreesY(rotation.pitch);
                const forward = matrix.apply(Vector.UP);
                const right = matrix.apply(Vector.RIGHT);
                nextLocation = location
                    .addVector(forward.scale(moveY))
                    .addVector(right.scale(-moveX));
            }

            break;
        case ViewportMode.Top:
            nextLocation = location.add(moveX, moveY, 0);
            break;
        case ViewportMode.Front:
            nextLocation = location.add(moveX, 0, -moveY);
            break;
        case ViewportMode.Side:
            nextLocation = location.add(0, moveX, -moveY);
            break;
    }
    return [nextRotation, nextLocation];
}