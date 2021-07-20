import { IBuilder } from "../controller/builder/IBuilder"
import { BrushModel } from "../model/BrushModel"
import { BrushPolygon } from "../model/BrushPolygon";
import { Vector } from "../model/Vector";

export class CubeBuilder implements IBuilder
{
    build(): BrushModel {
        const result = new BrushModel()
        const size = new Vector(256,256,256)

        for (let i=0; i<8; i++)
        {
            result.addVertex(new Vector(
                ((i&4)-.5)*size.x,
                ((i&2)-.5)*size.y,
                ((i&1)-.5)*size.z,
            ))
        }
        result.polygons.push(new BrushPolygon())
        throw new Error("Method not implemented.");
    }

}