import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"
import { DEFAULT_INTERACTION_BUFFER } from "../../model/InteractionBuffer"

export const set_interaction_axis_lock_commands = [
    "x",
    "y",
    "z", 
    "x" + "y",
    "y" + "z",
    "x" + "z",
].map(build_axis_command)

function build_axis_command(mode: string): ICommandInfoV2 {
    const is_plane = mode.length === 2
    const mode_type = is_plane ? "plane" : "axis"
    const description = `Constrain interaction to ${mode.toUpperCase()} ${mode_type}`
    const lock_x = mode.indexOf("x") === -1
    const lock_y = mode.indexOf("y") === -1
    const lock_z = mode.indexOf("z") === -1
    const unlocked_mode = (
        (lock_x ? '' : 'x')+
        (lock_y ? '' : 'y')+
        (lock_z ? '' : 'z')   
    )
    const shortcut = is_plane ? `shift + ${unlocked_mode}` : mode
    return {
        description,
        shortcut,
        exec: state => set_interaction_axis_lock(state, lock_x, lock_y, lock_z),
        keep_status_by_default: true,
    }
}

function set_interaction_axis_lock(
    state: EditorState, 
    x_axis: boolean, 
    y_axis: boolean, 
    z_axis:boolean,
): EditorState {
    const current = state.interaction_buffer.axis_lock
    if (current.x_axis === x_axis && current.y_axis === y_axis && current.z_axis === z_axis){
        // toggle off
        return {
            ...state,
            interaction_buffer: {
                ...state.interaction_buffer,
                axis_lock: DEFAULT_INTERACTION_BUFFER.axis_lock,
            },
        }   
    } else {
        // lock as requested
        return {
            ...state,
            interaction_buffer: {
                ...state.interaction_buffer,
                axis_lock: { x_axis, y_axis, z_axis },
            },
        }
    }
}
