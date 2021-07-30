import { ICommandInfoV2 } from "../../controller/command"
import { change_selected_brushes, select_actors } from "../../model/algorithms/editor_state_change"
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
    return select_actors(state, a => true)
}

function select_all_vertexes(state: EditorState){
    return change_selected_brushes(state, brush => {
        if (!brush.vertexes.find(v => !v.selected)){
            return brush
        }
        const new_brush = brush.shallowCopy()
        new_brush.vertexes = brush.vertexes.map(vertex => {
            if (vertex.selected){
                return vertex
            }
            const new_vertex = vertex.shallowCopy()
            new_vertex.selected = true
            return new_vertex
        })
        return new_brush
    })
}
