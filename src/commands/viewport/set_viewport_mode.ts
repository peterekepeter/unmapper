import { ICommandInfoV2 } from "../../controller/command"
import { change_viewport_at_index } from "../../model/algorithms/editor_state_change"
import { ViewportMode } from "../../model/ViewportMode"

export const set_viewport_mode_command: ICommandInfoV2 = {
    exec: (current_state, viewport_index: number, mode: ViewportMode) => 
        change_viewport_at_index(current_state, viewport_index, viewport => ({ 
            ...viewport, mode 
        })),
    keep_status_by_default: true
}
