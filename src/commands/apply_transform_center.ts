import { ICommandInfoV2 } from "../controller/command"
import { pipe } from "../util/pipe"
import { apply_transform_command } from "./apply_transform"
import { recalculate_brush_center_command } from "./recalculate_brush_center"

export const apply_transform_center_command: ICommandInfoV2 = {

    description: "Apply transform and recalculate brush center",
    shortcut: 'shift + t',
    exec: pipe(apply_transform_command.exec, recalculate_brush_center_command.exec, (state) => ({
        ...state,
        status: {
            is_error: false,
            message: "Applied transform to " + state.selection.actors.length + " brushes.",
        },
    })),
    
}
