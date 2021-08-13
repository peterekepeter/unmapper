import { ICommandInfoV2 } from "../../controller/command"
import { Rotation } from "../../model/Rotation"
import { change_viewport_at_index } from "../../model/state"
import { Vector } from "../../model/Vector"

export const update_view_location_rotation_command: ICommandInfoV2 = {
    exec: (current_state, viewport_index: number, location: Vector, rotation: Rotation) => 
        change_viewport_at_index(current_state, viewport_index, viewport => ({ 
            ...viewport, center_location: location, rotation 
        })),
    keep_status_by_default: true
}