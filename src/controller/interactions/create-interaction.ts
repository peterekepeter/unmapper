import { Interaction } from "./Interaction";
import { InteractionType } from "./InteractionType";
import { RotationInputInteraction } from "./RotationInputInteraction";
import { VectorInputInteraction } from "./VectorInputInteraction"

export function create_interaction(type: InteractionType): Interaction {
    switch (type) {
        case InteractionType.VectorOrScalarInput:
        case InteractionType.VectorInput:
            return new VectorInputInteraction()
        case InteractionType.RotationInput:
            return new RotationInputInteraction()
        default: throw new Error('undefined interaction type')
    }
}