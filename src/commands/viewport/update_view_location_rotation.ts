import { ICommandInfoV2 } from "../../controller/command"
import { change_viewport_at_index } from "../../model/algorithms/editor_state_change"
import { Rotation } from "../../model/Rotation"
import { Vector } from "../../model/Vector"

export const update_view_location_rotation_command: ICommandInfoV2 = {
    exec: (current_state, viewport_index: number, location: Vector, rotation: Rotation) => change_viewport_at_index(current_state, viewport_index, viewport => {
        return { ...viewport, center_location: location, rotation }
    })
}