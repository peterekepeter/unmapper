import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { change_selected_brushes } from "../model/state"
import { Vector } from "../model/Vector"

export const flip_polygon_normal_command: ICommandInfoV2 = {
    description: "Flip polygon (normal, winding, facing)",
    exec: flip_polygon_normal
}

function flip_polygon_normal(state: EditorState): EditorState {
    return change_selected_brushes(state, (oldBrush, _, selection) => {
        const selected = selection.vertexes
        if (selected.length < 3) {
            return oldBrush
        }
        const new_brush = oldBrush.shallowCopy()
        let poly_list_copied = false
        for (let i = 0; i < new_brush.polygons.length; i++) {
            const poly = new_brush.polygons[i]
            let is_poly_selected = true
            for (const poly_vert_idx of poly.vertexes) {
                if (selected.indexOf(poly_vert_idx) === -1) {
                    is_poly_selected = false
                    break
                }
            }
            if (is_poly_selected) {
                if (!poly_list_copied) {
                    new_brush.polygons = [ ...new_brush.polygons ]
                    poly_list_copied = true
                }
                const new_poly = poly.shallowCopy()
                new_brush.polygons[i] = new_poly
                new_poly.vertexes = [ ...new_poly.vertexes ]
                new_poly.vertexes.reverse()
                new_poly.normal = Vector.ZERO.subtractVector(new_poly.normal)
            }
        }
        return new_brush
    })
}