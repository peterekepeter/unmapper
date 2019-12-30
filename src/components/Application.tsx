import { importUnrealMap } from "../model/loader/import/import-unreal-map";
import { UnrealMap } from "../model/UnrealMap";
import { useState, useRef } from "react";
import React = require("react");
import { Actor } from "../model/Actor";
import { Polygon } from "../model/Polygon";
import { Vector } from "../model/Vector";


export const Application = () => {

    const canvasRef = useRef(null);
    const [unrealMap, updateUnrealMap] = useState(new UnrealMap());

    return <div>
        <h1>Hello!</h1>
        <textarea onChange={receiveLevel}></textarea>
        <canvas width="500" height="500" ref={canvasRef}></canvas>
    </div>;

    function receiveLevel(event : React.ChangeEvent<HTMLTextAreaElement>){
        const data = event.target.value;
        const map = importUnrealMap(data);
        console.log(map);
        updateUnrealMap(map);
        renderMap(map);
    }

    function renderMap(map :UnrealMap){
        console.log(canvasRef, canvasRef.current);
        const canvasElement : HTMLCanvasElement = canvasRef.current;
        const context = canvasElement.getContext('2d');
        const { width, height } = canvasElement;

        context.fillStyle = "#000";
        context.fillRect(0,0,width,height);
        
        for (const actor of map.actors){
            renderActor(actor, context, width, height);
        }
    }
}

function renderActor(actor: Actor, context : CanvasRenderingContext2D, width : number, height: number){
    if (actor.brushModel != null) {
        const polygons = actor.brushModel.polygons;
        context.strokeStyle = "#f12";
        context.lineWidth = 1.0;
        for (const polygon of polygons){
            renderPolygon(polygon, context, width, height, actor.location);
        }
    }
}

function renderPolygon(polygon: Polygon, context : CanvasRenderingContext2D, width : number, height: number, location: Vector){
    const last = polygon.vertexes[polygon.vertexes.length - 1];
    context.beginPath();
    context.moveTo(last.x + location.x, last.y + location.y);
    for (const vertex of polygon.vertexes){
        context.lineTo(vertex.x + location.x, vertex.y + location.y);
    }
    context.stroke();
}