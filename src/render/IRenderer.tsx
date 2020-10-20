import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";
import { Actor } from "../model/Actor";
import { Rotation } from "../model/Rotation";

export interface IRenderer {
    setShowVertexes(state: boolean) : void;
    setCenterTo(location : Vector) : void;
    setPerspectiveRotation(rotation : Rotation) : void;
    setPerspectiveMode(fieldOfView : number) : void;
    setTopMode(scale : number) : void;
    setFrontMode(scale : number) : void;
    setSideMode(scale : number) : void;
    render (unrealMap : UnrealMap) : void;
    findNearestActor(map: UnrealMap, canvasX: number, canvasY: number) : Actor;
    findNearestVertex(map: UnrealMap, canvasX: number, canvasY: number): [Actor, number];
}