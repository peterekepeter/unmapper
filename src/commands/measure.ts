import { ICommandInfoV2 } from "../controller/command"
import { VectorInteraction } from "../controller/interactions/stateful/VectorInteraction"
import { Vector } from "../model/Vector"

export const measure_command: ICommandInfoV2 = {
    description: 'Measure distance between two points',
    shortcut: 'm',
    args: [
        {
            interaction_factory: VectorInteraction.factory,
            example_values: [ Vector.FORWARD, Vector.RIGHT, Vector.UP ],
        },
    ],
    exec: (state, vector: Vector) => ({ 
        ...state, 
        status: { 
            ...state.status, 
            is_error: false, 
            message: `Distance: ${vector.length()}`,
        },
    }),
}
