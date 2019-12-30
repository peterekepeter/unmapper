import { UnrealMap } from "../model/UnrealMap";
import { Actor } from "../model/Actor";
import { Polygon } from "../model/Polygon";
import { IRenderer } from "./IRenderer";
import { Vector } from "../model/Vector";


export function WireframeRenderer(canvas : HTMLCanvasElement) : IRenderer
{
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    
    function renderMap(map : UnrealMap){
        context.fillStyle = "#000";
        context.fillRect(0,0,width,height);

        if (map == null){
            return;
        }
        
        for (const actor of map.actors){
            renderActor(actor);
        }
    }

    function renderActor(actor: Actor){
        if (actor.brushModel != null) {
            tx += actor.location.x;
            ty += actor.location.y;
            const polygons = actor.brushModel.polygons;
            context.strokeStyle = "#f12";
            context.lineWidth = 1.0;
            for (const polygon of polygons){
                renderPolygon(polygon, actor.location);
            }
            tx -= actor.location.x;
            ty -= actor.location.y;
        }
    }

    function renderPolygon(polygon: Polygon, location: Vector){
        const last = polygon.vertexes[polygon.vertexes.length - 1];
        context.beginPath();
        context.moveTo(getTransformedX(last),getTransformedY(last));
        for (const vertex of polygon.vertexes){
            context.lineTo(
                getTransformedX(vertex),
                getTransformedY(vertex));
        }
        context.stroke();
    }

    let tx = 512.0; 
    let ty = 1024.0;
    let tz = 512.0;
    let scale = 100.25;

    function getTransformedX(vector : Vector){
        return (vector.x + tx) / (vector.z + tz) * scale;
    }

    function getTransformedY(vector : Vector){
        return (vector.y + ty) / (vector.z + tz) * scale;
    }

    return {
        render: renderMap
    }
}