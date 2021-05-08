import { BrushPolygonUvData } from "./BrushPolygonUvData";
import { Vector } from "./Vector"

export class BrushPolygon implements BrushPolygonUvData {
    
    median: Vector = null;
    vertexes: number[] = [];
    edges: number[] = [];
    item = '';
    flags = 0;
    origin: Vector = Vector.ZERO;
    normal: Vector = Vector.UNIT_Z;
    textureU: Vector = Vector.UNIT_X;
    textureV: Vector = Vector.UNIT_Y;
    texture: string = null;
    link = 0;
    panU = 0;
    panV = 0;

    addVertexIndex(vertexIndex: number) {
        this.vertexes.push(vertexIndex)
    }

    shallow_copy() {
        const copy = new BrushPolygon()
        Object.assign(copy, this)
        return copy
    }

    /** @deprecated use shallow_copy */
    shallowCopy() {
        const copy = new BrushPolygon()
        Object.assign(copy, this)
        return copy
    }

}