import { importUnrealMap } from "../model/loader/import/import-unreal-map";
import { UnrealMap } from "../model/UnrealMap";
import { useState, useRef } from "react";
import React = require("react");
import { dummyAppData } from "./dummyAppData";
import { WireframeRenderer } from "../render/WireframeRenderer";
import { IRenderer } from "../render/IRenderer";


export const Application = () => {

    const [unrealMap, updateUnrealMap] : [UnrealMap, any] = useState(null);
    let renderer : IRenderer = null;
    let canvas : HTMLCanvasElement = null;

    function canvasRef(attachedCanvas : HTMLCanvasElement) {
        if (attachedCanvas != null){
            console.log(attachedCanvas);
            canvas = attachedCanvas;
            renderer = WireframeRenderer(attachedCanvas);
            renderer.render(unrealMap);
        }
    }

    if (unrealMap == null){
        setTimeout(() => receiveLevelData(dummyAppData), 100);
    }

    return <div>
        <h1>Hello!</h1>
        <textarea onChange={receiveLevel}></textarea>
        <canvas width="500" height="500" ref={canvas => canvasRef(canvas)}></canvas>
    </div>;

    function receiveLevel(event : React.ChangeEvent<HTMLTextAreaElement>){
        const data = event.target.value;
        receiveLevelData(data);
    }

    function receiveLevelData(data : string){
        const map = importUnrealMap(data);
        updateUnrealMap(map);
    }
}
