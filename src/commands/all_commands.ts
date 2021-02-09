import * as select_all from './select_all';
import { ICommandInfoV2 } from '../controller/command_registry';
import { create_polygon_command } from './create_polygon';
import { extrude_polygons_command } from './extrude_polygons';
import { delete_selected_command } from './delete_selected';
import { toggle_vertex_mode_command } from './toggle_vertex_mode';


export const get_all_commands_v2 : () => ICommandInfoV2[] = () => [
    select_all.select_all_command,
    toggle_vertex_mode_command,
    create_polygon_command,
    delete_selected_command,
    extrude_polygons_command
]
