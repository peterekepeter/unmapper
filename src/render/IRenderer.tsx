import { UnrealMap } from "../model/UnrealMap";

export interface IRenderer {
    render (unrealMap : UnrealMap) : void;
}