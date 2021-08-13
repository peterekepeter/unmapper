import { ICommandInfoV2 } from "../../controller/command"
import { select_actors } from "../../model/state/select_actors"
import { EditorState } from "../../model/EditorState"

export const select_all_command: ICommandInfoV2 = {
    keep_status_by_default: true,
    description: "Select All Objects",
    shortcut: 'ctrl + a',
    exec: implementation
}

function implementation(state : EditorState) : EditorState {
    if (state.options.vertex_mode){
        return select_all_vertexes(state)
    } else {
        return select_all_actors(state)
    }
}

function select_all_actors(state : EditorState) : EditorState {
    return select_actors(state, () => true)
}

function select_all_vertexes(state: EditorState): EditorState {
    return {
        ...state, 
        selection: {
            actors: state.selection.actors.map(s => ({ 
                ...s, 
                vertexes: state.map.actors[s.actor_index]?.brushModel.vertexes.map((_,i) => i) 
            }))
        }
    }
}
