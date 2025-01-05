
import { ICommandInfoV2 } from "../../controller/command"

export const create_set_world_grid_command: (size: number) => ICommandInfoV2 = (size: number) => ({
    exec: state => ({ ...state, options: { ...state.options, grid: size } }),
    description: size > 0 ? `Set world grid to ${size}x${size}x${size}` : 'Disable world grid',
    keep_status_by_default: true,
})

export function get_world_grid_commands(): ICommandInfoV2[] {
    return [
        create_set_world_grid_command(0),
        create_set_world_grid_command(0.125),
        create_set_world_grid_command(0.25),
        create_set_world_grid_command(0.5),
        create_set_world_grid_command(1),
        create_set_world_grid_command(2),
        create_set_world_grid_command(4),
        create_set_world_grid_command(8),
        create_set_world_grid_command(16),
        create_set_world_grid_command(32),
        create_set_world_grid_command(64),
        create_set_world_grid_command(128),
        create_set_world_grid_command(256),
    ]
}
