import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";
import { Actor } from "../model/Actor";

export interface IRenderer {
    setCenterTo(location : Vector) : void;
    setPerspectiveRotation(euler : Vector) : void;
    setPerspectiveMode(fieldOfView : number) : void;
    setTopMode(scale : number) : void;
    setFrontMode(scale : number) : void;
    setSideMode(scale : number) : void;
    render (unrealMap : UnrealMap) : void;
    findNearestActor(map: UnrealMap, canvasX: number, canvasY: number) : Actor;
}