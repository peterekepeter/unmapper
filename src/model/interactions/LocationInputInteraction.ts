import { Vector } from "../Vector";
import { Interaction } from "./Interaction";
import { InteractionType } from "./InteractionType";

export class LocationInputInteraction extends Interaction
{
    location: Vector;

    constructor(){
        super(InteractionType.LocationInput)
    }
}