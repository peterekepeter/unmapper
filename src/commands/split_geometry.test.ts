import { AppController } from "../controller/AppController";
import { Vector } from "../model/Vector";
import { ViewportMode } from "../model/ViewportMode";
import { get_world_plane_from_interaction_buffer } from "./clip_geometry";
import { generate_cube_command } from "./generators/generate_cube";
import { confirm_interaction_point_command } from "./interaction/confirm_interaction_point";
import { split_geometry_command } from "./split_geometry";



test('can split cube into two', () => {
    const controller = new AppController();
    controller.execute(generate_cube_command);
    expect(controller.current_state.map.actors).toHaveLength(1);
    console.log('a',controller.current_state.interaction_buffer.points);
    controller.execute(confirm_interaction_point_command, new Vector(1, 0, 0), ViewportMode.Top)
    console.log('b',controller.current_state.interaction_buffer.points);
    controller.execute(confirm_interaction_point_command, new Vector(2, 0, 1), ViewportMode.Top)
    console.log('c',controller.current_state.interaction_buffer.points);
    console.log('plane', get_world_plane_from_interaction_buffer(controller.current_state.interaction_buffer))
    controller.interactively_execute(split_geometry_command);
    expect(controller.current_state.map.actors).toHaveLength(2);
})