import { ICommandInfoV2 } from "../../controller/command"
import { change_viewport_at_index } from "../../model/state"
import { Vector } from "../../model/Vector"

export const update_view_location_command: ICommandInfoV2 = {
    exec: (current_state, viewport_index: number, location: Vector) => 
        change_viewport_at_index(current_state, viewport_index, viewport => {
            return { ...viewport, center_location: location }
        }), 
    keep_status_by_default: true
}
