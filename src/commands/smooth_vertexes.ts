import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { RandomVectorGenerator } from "../model/random/RandomVectorGenerator"
import { change_selected_vertexes } from "../model/state"
import { Vector } from "../model/Vector"

export const smooth_vertexes_command: ICommandInfoV2 = {
    description: 'Smooth Vertexes: relaxes vertex positions',
    exec: smooth_vertexes,
}

function smooth_vertexes(state: EditorState): EditorState {
    const generator = new RandomVectorGenerator()
    generator.seed = Date.now()
    return change_selected_vertexes(
        state, 
        (v, i, b) => {
            const near = []
            for (const edge of b.edges){
                if (edge.vertexIndexA === i){
                    near.push(edge.vertexIndexB)
                }
                if (edge.vertexIndexB === i){
                    near.push(edge.vertexIndexA)
                }
            }
            if (near.length <= 0){
                return v
            }
            let x=v.x * near.length
            let y=v.y * near.length
            let z=v.z * near.length
            for (const j of near)
            {
                const vertex = b.vertexes[j].position
                x += vertex.x
                y += vertex.y
                z += vertex.z
            }
            x /= near.length * 2
            y /= near.length * 2
            z /= near.length * 2
            return new Vector(x, y, z)
        },
    )
}
