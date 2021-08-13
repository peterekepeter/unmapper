import { ICommandInfoV2 } from "../../controller/command"
import { Rotation } from "../../model/Rotation"
import { change_viewport_at_index } from "../../model/state"

export const update_view_rotation_command: ICommandInfoV2 = {
    exec: (current_state, viewport_index: number, rotation: Rotation) => 
        change_viewport_at_index(current_state, viewport_index, viewport => {
            return { ...viewport, rotation }
        }),
    keep_status_by_default: true
}
