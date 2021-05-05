import { ICommandInfoV2 } from "../controller/command";
import { align_brush_model_to_grid, align_to_grid } from "../model/algorithms/alignToGrid";
import { change_selected_brushes } from "../model/algorithms/editor_state_change";
import { EditorState } from "../model/EditorState";
import { Vector } from "../model/Vector";


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
    const grid = new Vector(size, size, size);
    return change_selected_brushes(state, brush => {
        if (state.options.vertex_mode === true) {
            const next = brush.shallowCopy();
            next.vertexes = next.vertexes.map(currentVertex => {
                if (currentVertex.selected) {
                    const nextVertex = currentVertex.shallowCopy();
                    nextVertex.position = align_to_grid(nextVertex.position, grid);
                    return nextVertex;
                } else {
                    return currentVertex;
                }
            })
            return next;
        } else {
            return align_brush_model_to_grid(brush, grid)
        }
    });
}
