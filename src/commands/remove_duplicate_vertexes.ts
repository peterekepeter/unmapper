import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { change_selected_brushes } from "../model/state"


export const remove_duplicate_vertexes_command: ICommandInfoV2 = {
    description: 'Recalculate brush center',
    exec: state => remove_duplicate_vertexes(state, 1e-3),
}

function remove_duplicate_vertexes(state: EditorState, threshold: number): EditorState {
    return change_selected_brushes(state, (b, a, as)=>{
        for (let i=0; i<b.vertexes.length; i++){
            for (let j=0; j<b.vertexes.length; j++){
                
            }
        }
        return b
    })
}
