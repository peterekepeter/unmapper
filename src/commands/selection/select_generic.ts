import { ICommandInfoV2 } from "../../controller/command"
import { change_actors } from "../../model/algorithms/editor_state_change"
import { EditorError } from "../../model/error/EditorError"
import { EditorState } from "../../model/EditorState"


export interface GenericSelection {
    actors: {
        actor_index: number,
        vertexes?: number[],
        edges?: number[],
        polygons?: number[]

        polygon_vertexes?: {
            // used for selected a vertex online inside a polygon
            // used for selecting vertexes in UV mode
            polygon_index: number, 
            vertexes: number[]
        }
    }[]
}

export const select_generic_command: ICommandInfoV2 = {
    keep_status_by_default: true,
    exec: select_generic
}

function select_generic(state: EditorState, selection: GenericSelection): EditorState {
    if (!selection) {
        selection = {
            actors: [] // by default deselect all
        }
    }
    EditorError.if(!selection.actors, 'invalid command argument')
    return change_actors(state, (a, i) => {
        const actor_selection = selection.actors.find(s => s.actor_index === i)
        const actor_selected_next = actor_selection != null
        if (a.selected != actor_selected_next && !state.options.vertex_mode) {
            a = a.immutable_update(actor => actor.selected = actor_selected_next)
        }
        if (state.options.vertex_mode && a.brushModel) {

            let need_change = false
            for (let i = 0; i < a.brushModel.vertexes.length; i++) {
                const should_be_selected = actor_selection && actor_selection.vertexes && actor_selection.vertexes.indexOf(i) !== -1
                if (a.brushModel.vertexes[i].selected != should_be_selected) {
                    need_change = true
                    break
                }
            }
            if (need_change) {
                a = a.immutable_update(a => { 
                    a.brushModel = a.brushModel.shallow_copy()
                    a.brushModel.vertexes = a.brushModel.vertexes.map((v, i) => {
                        const should_be_selected = actor_selection && actor_selection.vertexes && actor_selection.vertexes.indexOf(i) !== -1
                        if (v.selected != should_be_selected) {
                            const next_vertex = v.shallowCopy()
                            next_vertex.selected = should_be_selected
                            return next_vertex
                        }
                        return v
                    })
                    return a
                })
            }
        }
        return a
    })
}
