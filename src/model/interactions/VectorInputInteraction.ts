import { Vector } from "../Vector";
import { Interaction } from "./Interaction";
import { InteractionType } from "./InteractionType";

export class VectorInputInteraction extends Interaction
{
    origin: Vector = null;
    vector: Vector = Vector.ZERO;

    constructor(){
        super(InteractionType.VectorInput)
    }
}