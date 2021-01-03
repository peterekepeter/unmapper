
import * as select_all from './select_all';
import * as toggle_vertex_mode from './toggle_vertex_mode';
import { ICommandInfoV2 } from '../controller/command_registry';


export const get_all_commands_v2 : () => ICommandInfoV2[] = () => [
    select_all,
    toggle_vertex_mode
]
