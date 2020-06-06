import React = require("react")
import { IRenderer } from "../render/IRenderer";
import { WireframeRenderer } from "../render/WireframeRenderer";
import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";

export enum ViewportMode 
{
    Top,
    Front,
    Side,
    Perspective
}

export const Viewport = ({ 
    map = new UnrealMap(),
    location = new Vector(0,0,0),
    mode = ViewportMode.Top }) => {

    let renderer : IRenderer = null;

    function canvasRef(attachedCanvas : HTMLCanvasElement) {
        if (attachedCanvas != null){
            renderer = WireframeRenderer(attachedCanvas);
            renderer.setCenterTo(location);
            switch(mode){
                case ViewportMode.Top: renderer.setTopMode(1/2000); break;
                case ViewportMode.Front: renderer.setFrontMode(1/2000); break;
                case ViewportMode.Side: renderer.setSideMode(1/2000); break;
                case ViewportMode.Perspective: renderer.setPerspectiveMode(90); break;
            }
            renderer.render(map);
        }
    }

    return <canvas width="500" height="500" ref={canvas => canvasRef(canvas)}></canvas>
}