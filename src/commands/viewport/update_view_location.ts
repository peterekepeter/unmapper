import { ICommandInfoV2 } from "../../controller/command_registry"
import { change_viewport_at_index } from "../../model/algorithms/editor_state_change"
import { Vector } from "../../model/Vector"

export const update_view_location_command: ICommandInfoV2 = {
    exec: (current_state, viewport_index: number, location: Vector) => change_viewport_at_index(current_state, viewport_index, viewport => {
        return { ...viewport, center_location: location }
    })
}
