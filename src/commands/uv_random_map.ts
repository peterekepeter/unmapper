import { ICommandInfoV2 } from "../controller/command"
import { calculate_polygon_median } from "../model/algorithms/calculate_polygon_median"
import { calculate_polygon_normal } from "../model/algorithms/calculate_polygon_normal"
import { change_selected_brushes } from "../model/algorithms/editor_state_change"
import { Vector } from "../model/Vector"

export const uv_random_map_command: ICommandInfoV2 = {
    description: 'UV: random polygon uv mapping',
    exec: state => change_selected_brushes(state, old_brush => {
        const new_brush = old_brush.shallow_copy()
        new_brush.polygons = old_brush.polygons.map(old_polygon => {
            const median = calculate_polygon_median(old_brush.vertexes, old_polygon)
            const normal = calculate_polygon_normal(old_brush.vertexes, old_polygon)
            const rand_unit = new Vector(
                Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize()

            const n_dot_v = normal.dot(rand_unit)
            const surface_u = rand_unit.subtract_vector(rand_unit.scale(n_dot_v)).normalize()
            const surface_v = normal.cross(surface_u)

            const new_polygon = old_polygon.shallow_copy()
            new_polygon.origin = median
            new_polygon.textureU = surface_u
            new_polygon.textureV = surface_v
            new_polygon.panU = Math.floor(Math.random() * 1024)
            new_polygon.panV = Math.floor(Math.random() * 1024)
            return new_polygon
        })
        return new_brush
    })
}