import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { DEFAULT_INTERACTION_BUFFER } from "../model/InteractionBuffer"

export const measure_command: ICommandInfoV2 = {
    description: 'Measure distance between two points',
    shortcut: 'm',
    uses_interaction_buffer: true,
    exec: state => exec_measure(state),
}

function exec_measure(state: EditorState): EditorState {
    const buffer = state.interaction_buffer
    if (buffer.points.length < 2){
        return state
    }
    const vector = buffer.points[0].vector_to_vector(buffer.points[1])
    return { 
        ...state, 
        interaction_buffer: DEFAULT_INTERACTION_BUFFER,
        status: { 
            ...state.status, 
            is_error: false, 
            message: `Distance: ${vector.length()}`,
        },
    }
}

