import { Vector } from "./Vector";


export class BrushPolygonUvData {
    origin: Vector = Vector.ZERO;
    textureU: Vector = Vector.UNIT_X;
    textureV: Vector = Vector.UNIT_Y;
    panU = 0;
    panV = 0;
}
