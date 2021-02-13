import { ICommandInfoV2 } from "../../controller/command_registry";
import { change_viewport_at_index } from "../../model/algorithms/common";

export const set_viewport_zoom_command: ICommandInfoV2 = {
    exec: (state, index: number, level: number) => change_viewport_at_index(state, index,
        viewport => ({ ...viewport, zoom_level: level }))
}
