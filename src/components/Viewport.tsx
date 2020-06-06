import { useState } from "react";
import { IRenderer } from "../render/IRenderer";
import { createWireframeRenderer } from "../render/WireframeRenderer";
import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";
import React = require("react");

export enum ViewportMode {
    Top,
    Front,
    Side,
    Perspective
}

export const Viewport = ({
    map = new UnrealMap(),
    location = new Vector(0, 0, 0),
    mode = ViewportMode.Top }) => {

    let [canvas, setCanvas] 
        = useState<HTMLCanvasElement>(null);

    let [renderer, setRenderer]
        = useState<IRenderer>(null);

    let [viewMode, setViewMode]
        = useState(mode);

    let [viewLocation, setViewLocation] 
        = useState(location);

    let [isMouseDown, setMouseDown] = useState(false);

    function canvasRef(attachedCanvas: HTMLCanvasElement) {
        if (attachedCanvas != null &&
            (canvas == null || renderer == null)){
            setCanvas(attachedCanvas);
            setRenderer(createWireframeRenderer(attachedCanvas));
        }
    }

    if (renderer != null)
    {
        const ortohoScale = 1/1024;
        const perspectiveFov = 90;
        renderer.setCenterTo(viewLocation);
        switch (viewMode){
            case ViewportMode.Perspective:
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
        console.log('canvas re-render');
        renderer.render(map);
    }

    const usePointerLock = true;

    return <canvas 
        width="500" 
        height="300" 
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        ref={canvas => canvasRef(canvas)}/>;

    function onPointerDown(event : React.PointerEvent<HTMLCanvasElement>)
    {
        canvas.setPointerCapture(event.pointerId);
        if (usePointerLock){
            canvas.requestPointerLock();
        }
        setMouseDown(true);
    }

    function onPointerUp(event : React.PointerEvent<HTMLCanvasElement>)
    {
        canvas.releasePointerCapture(event.pointerId);
        if (usePointerLock){
            document.exitPointerLock();
        }
        setMouseDown(false);
    }

    function onPointerMove(event : React.PointerEvent<HTMLCanvasElement>)
    {
        if (!isMouseDown){
            return;
        }
        const dx = event.movementX;
        const dy = event.movementY;
        setViewLocation(updateLocation(viewLocation, viewMode, dx, dy));

    }

}

function updateLocation(
    viewLocation : Vector, 
    viewmode : ViewportMode, 
    pointerMovementX : number, 
    pointerMovementY : number) 
    : Vector
{
    let x=0, y=0, z=0;
    switch (viewmode){
        case ViewportMode.Perspective:

            // todo
            x += pointerMovementX;
            y += pointerMovementY;

            break;
        case ViewportMode.Top:
            x += pointerMovementX;
            y += pointerMovementY;
            break;
        case ViewportMode.Front:
            x += pointerMovementX;
            z -= pointerMovementY;
            break;
        case ViewportMode.Side:
            y += pointerMovementX;
            z -= pointerMovementY;
            break;
    }
    return viewLocation.add(x,y,z);
}