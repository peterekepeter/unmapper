import { ICommandInfoV2 } from "../controller/command_registry";
import { change_selected_brushes } from "../model/algorithms/editor_state_change";
import { uv_triplanar_map } from "../model/algorithms/uv-triplanar-map";

export const uv_triplanar_map_command: ICommandInfoV2 = {
    description: 'UV: triplanar map brush polygons',
    exec: state => change_selected_brushes(state, uv_triplanar_map)
}