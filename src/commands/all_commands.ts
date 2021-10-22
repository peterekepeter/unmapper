
import { ICommandInfoV2 } from "../controller/command"
import { align_vertexes_to_8_grid, align_vertexes_to_16_grid, align_vertexes_to_32_grid } from './align_vertexes_to_grid'
import { apply_transform_command } from "./apply_transform"
import { clear_status_command } from "./clear_status_command"
import { clip_geometry_command } from "./clip_geometry"
import { create_polygon_command } from './create_polygon'
import { delete_selected_command } from './delete_selected'
import { duplicate_selected_command } from "./duplicate_selected"
import { toggle_box_select_command } from "./editor/toggle_box_select"
import { toggle_editor_layout_command } from "./editor/toggle_editor_layout"
import { toggle_preserve_vertex_uv_command } from "./editor/toggle_preserve_vertex_uv"
import { toggle_vertex_mode_command } from './editor/toggle_vertex_mode'
import { extrude_polygons_command } from './extrude_polygons'
import { flip_polygon_normal_command } from './flip_polygon_normal'
import { generate_cube_command } from "./generators/generate_cube"
import { set_interaction_axis_lock_commands } from "./interaction/set_interaction_axis_lock"
import { measure_command } from "./measure_distance"
import { move_command } from "./move_selected"
import { rotate_command } from "./rotate_selected"
import { scale_command } from "./scale_selected"
import { select_all_command } from './selection/select_all'
import { reset_initial_state, set_initial_state } from "./set_initial_state"
import { shuffle_brush_polygons_command } from './shuffle_brush_polygons'
import { smooth_vertexes_command } from "./smooth_vertexes"
import { triangulate_mesh_polygons_command } from './triangulate_mesh_polygons'
import { uv_random_map_command } from "./uv_random_map"
import { uv_triplanar_map_command } from './uv_triplanar_map'
import { vertex_noise_command } from "./vertex_noise"

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
    duplicate_selected_command,
    apply_transform_command,
    uv_random_map_command,
    set_initial_state,
    reset_initial_state,
    measure_command,
    clear_status_command,
    vertex_noise_command,
    smooth_vertexes_command,
    ...set_interaction_axis_lock_commands,
    ...get_generate_commands(),
] }

function get_generate_commands(): ICommandInfoV2[] { return [generate_cube_command] }
