import { FromToInteraction } from "./FromToInteraction";
import { Interaction } from "./Interaction";
import { InteractionType } from "./InteractionType";
import { LocationInputInteraction } from "./LocationInputInteraction";
import { RotationInputInteraction } from "./RotationInputInteraction";
import { VectorInputInteraction } from "./VectorInputInteraction"

export function create_interaction(type: InteractionType): Interaction {
    switch (type) {
        case InteractionType.VectorOrScalarInput:
        case InteractionType.VectorInput:
            return new VectorInputInteraction()
        case InteractionType.RotationInput:
            return new RotationInputInteraction()
        case InteractionType.FromToInteraction:
            return new FromToInteraction()
        case InteractionType.LocationInput:
            return new LocationInputInteraction()
        default: throw new Error('undefined interaction type')
    }
}