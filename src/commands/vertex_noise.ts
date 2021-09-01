import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { RandomVectorGenerator } from "../model/random/RandomVectorGenerator"
import { change_selected_vertexes } from "../model/state"

export const vertex_noise_command: ICommandInfoV2 = {
    description: 'Vertex Noise: randomly displaces vertexes',
    exec: vertex_noise,
}

function vertex_noise(state: EditorState): EditorState {
    const generator = new RandomVectorGenerator()
    generator.seed = Date.now()
    return change_selected_vertexes(
        state, 
        v => v.add_vector(generator.next_vector_from_unit_sphere_volume().scale(64)),
    )
}
