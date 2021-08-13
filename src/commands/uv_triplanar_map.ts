import { ICommandInfoV2 } from "../controller/command"
import { uv_triplanar_map } from "../model/algorithms/uv-triplanar-map"
import { change_selected_brushes } from "../model/state"

export const uv_triplanar_map_command: ICommandInfoV2 = {
    description: 'UV: triplanar map brush polygons',
    exec: state => change_selected_brushes(state, uv_triplanar_map)
}