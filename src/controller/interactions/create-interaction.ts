import { IInteraction } from "./IInteraction";
import { InteractionType } from "./InteractionType";
import { VectorInputInteraction } from "./VectorInputInteraction"

export function create_interaction(type: InteractionType): IInteraction {
    switch (type) {
        case InteractionType.VectorOrScalarInput:
        case InteractionType.VectorInput:
            return new VectorInputInteraction()
        default: throw new Error('undefined interaction type')
    }
}