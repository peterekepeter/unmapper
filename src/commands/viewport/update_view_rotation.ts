import { ICommandInfoV2 } from "../../controller/command_registry"
import { change_viewport_at_index } from "../../model/algorithms/editor_state_change"
import { Rotation } from "../../model/Rotation"

export const update_view_rotation_command: ICommandInfoV2 = {
    exec: (current_state, viewport_index: number, rotation: Rotation) => change_viewport_at_index(current_state, viewport_index, viewport => {
        return { ...viewport, rotation }
    })
}
