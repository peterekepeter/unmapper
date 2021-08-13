import { ICommandInfoV2 } from "../controller/command"
import { align_brush_model_to_grid, align_to_grid } from "../model/algorithms/alignToGrid"
import { EditorState } from "../model/EditorState"
import { change_selected_brushes, change_selected_vertexes } from "../model/state"
import { Vector } from "../model/Vector"


export const align_vertexes_to_32_grid: ICommandInfoV2 = {
    exec: state => align_vertexes_to_grid(state, 32),
    description: "Align Mesh Vertexes to 32x32x32 Grid"
}

export const align_vertexes_to_16_grid: ICommandInfoV2 = {
    exec: state => align_vertexes_to_grid(state, 32),
    description: "Align Mesh Vertexes to 16x16x16 Grid"
}

export const align_vertexes_to_8_grid: ICommandInfoV2 = {    
    exec: state => align_vertexes_to_grid(state, 32),
    description: "Align Mesh Vertexes to 8x8x8 Grid"
}

function align_vertexes_to_grid(state: EditorState, size: number): EditorState {
    const grid = new Vector(size, size, size)
    if (state.options.vertex_mode){
        return change_selected_vertexes(state, v => align_to_grid(v, grid))
    } else {
        return change_selected_brushes(state, b => align_brush_model_to_grid(b, grid))
    }
}
