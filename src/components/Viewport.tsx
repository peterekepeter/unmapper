import React = require("react")
import { IRenderer } from "../render/IRenderer";
import { WireframeRenderer } from "../render/WireframeRenderer";
import { UnrealMap } from "../model/UnrealMap";


export const Viewport = ({ map = new UnrealMap() }) => {

    let renderer : IRenderer = null;

    function canvasRef(attachedCanvas : HTMLCanvasElement) {
        if (attachedCanvas != null){
            renderer = WireframeRenderer(attachedCanvas);
            renderer.render(map);
        }
    }

    return <div>
        <canvas width="500" height="500" ref={canvas => canvasRef(canvas)}></canvas>
    </div>
}