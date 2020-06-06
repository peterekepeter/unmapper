import { UnrealMap } from "../model/UnrealMap";
import { Vector } from "../model/Vector";

export interface IRenderer {
    setCenterTo(location : Vector) : void;
    setPerspectiveRotation(euler : Vector) : void;
    setPerspectiveMode(fieldOfView : number) : void;
    setTopMode(scale : number) : void;
    setFrontMode(scale : number) : void;
    setSideMode(scale : number) : void;
    render (unrealMap : UnrealMap) : void;
}