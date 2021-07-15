import { ICommandInfoV2 } from "../../controller/command";
import { change_viewport_at_index } from "../../model/algorithms/editor_state_change";

export const set_viewport_zoom_command: ICommandInfoV2 = {
    exec: (state, index: number, level: number) => change_viewport_at_index(state, index,
        viewport => ({ ...viewport, zoom_level: level })
    ),
    keep_status_by_default: true
}
