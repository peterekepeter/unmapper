import { ICommandInfoV2 } from "../controller/command"
import { createBrushPolygon } from "../model/algorithms/createBrushPolygon"
import { EditorError } from "../model/error/EditorError"
import { EditorState } from "../model/EditorState"
import { change_selected_brushes } from "../model/state"


export const create_polygon_command : ICommandInfoV2 = {
    description: "Create polygon from selected vertexes",
    shortcut: "f",
    exec
}

function exec(state: EditorState) : EditorState {
    if (!state.options.vertex_mode){
        throw new EditorError("Need to be in vertex mode!")
    }
    return change_selected_brushes(state, (brush, _, selection) => {
        return createBrushPolygon(brush, selection.vertexes)
    })
}