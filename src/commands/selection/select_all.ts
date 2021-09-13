import { ICommandInfoV2 } from "../../controller/command"
import { ActorSelection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { select_actors } from "../../model/state/select_actors"
import { replace_selection } from "./replace_selection"

export const select_all_command: ICommandInfoV2 = {
    keep_status_by_default: true,
    description: "Select All Objects",
    shortcut: 'ctrl + a',
    exec: implementation,
}

function implementation(state : EditorState) : EditorState {
    if (state.options.vertex_mode){
        return select_all_edit_mode(state)
    } else {
        return select_all_actors(state)
    }
}

function select_all_actors(state : EditorState) : EditorState {
    return select_actors(state, () => true)
}

function select_all_edit_mode(state: EditorState): EditorState {
    const selection = {
        actors: state.selection.actors.map(old_selection => { 
            const brush = state.map.actors[old_selection.actor_index]?.brushModel
            if (!brush){
                return old_selection
            }
            const new_selection : ActorSelection = {
                ...old_selection, 
                vertexes: brush.vertexes.map((_, i) => i), 
                edges: brush.edges.map((_, i) => i),
                polygons: brush.polygons.map((_, i) => i),
                polygon_vertexes: brush.polygons.map((p, i) => ({
                    polygon_index: i,
                    edges: p.edges.map((_, i) => i),
                    vertexes: p.vertexes.map((_, i) => i),
                })),
            }
            return new_selection
        }),
    }
    return replace_selection(state, selection)
}
