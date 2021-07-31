
import { ICommandInfoV2 } from "../controller/command"
import { create_polygon_command } from './create_polygon'
import { extrude_polygons_command } from './extrude_polygons'
import { delete_selected_command } from './delete_selected'
import { toggle_vertex_mode_command } from './editor/toggle_vertex_mode'
import { select_all_command } from './selection/select_all'
import { align_vertexes_to_16_grid, align_vertexes_to_32_grid, align_vertexes_to_8_grid } from './align_vertexes_to_grid'
import { shuffle_brush_polygons_command } from './shuffle_brush_polygons'
import { triangulate_mesh_polygons_command } from './triangulate_mesh_polygons'
import { uv_triplanar_map_command } from './uv_triplanar_map'
import { flip_polygon_normal_command } from './flip_polygon_normal'
import { toggle_editor_layout_command } from "./editor/toggle_editor_layout"
import { move_command } from "./move"
import { rotate_command } from "./rotate"
import { apply_transform_command } from "./apply_transform"
import { uv_random_map_command } from "./uv_random_map"
import { scale_command } from "./scale"
import { reset_initial_state, set_initial_state } from "./set_initial_state"
import { toggle_preserve_vertex_uv_command } from "./editor/toggle_preserve_vertex_uv"
import { toggle_box_select_command } from "./editor/toggle_box_select"
import { clip_geometry_command } from "./clip_geometry"
import { measure_command } from "./measure"
import { generate_cube_command } from "./generators/generate_cube"
import { clear_status_command } from "./clear_status_command"


export function get_all_commands_v2(): ICommandInfoV2[] { return [
    select_all_command,
    toggle_vertex_mode_command,
    create_polygon_command,
    clip_geometry_command,
    delete_selected_command,
    extrude_polygons_command,
    align_vertexes_to_32_grid,
    align_vertexes_to_16_grid,
    align_vertexes_to_8_grid,
    flip_polygon_normal_command,
    shuffle_brush_polygons_command,
    triangulate_mesh_polygons_command,
    uv_triplanar_map_command,
    toggle_editor_layout_command,
    toggle_preserve_vertex_uv_command,
    toggle_box_select_command,
    move_command,
    rotate_command,
    scale_command,
    apply_transform_command,
    uv_random_map_command,
    set_initial_state,
    reset_initial_state,
    measure_command,
    clear_status_command,
    ...get_generate_commands()
] }

function get_generate_commands(): ICommandInfoV2[] { return [ 
    generate_cube_command 
] }
