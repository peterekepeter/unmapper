import { ICommandInfoV2 } from "../controller/command"
import { EditorError } from "../model/error"
import { Vector } from "../model/Vector"
import { move_selected_actors } from "./move_selected"

export const move_by_negative_32_units_command: ICommandInfoV2 = {
    description: 'Move by -32 units on all axes',
    exec: (state) => {
        EditorError.if(state.options.vertex_mode, "should not be in vertex mode")
        return move_selected_actors(state, new Vector(-32, -32, -32))
    },
}
