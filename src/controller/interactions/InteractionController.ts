import { make_actor_selection_command } from "../../commands/selection/make_actor_selection"
import { select_toggle_vertex_command } from "../../commands/selection/select_toggle_vertex"
import { select_vertex_command } from "../../commands/selection/select_vertex"
import { toggle_actor_selected_command } from "../../commands/selection/toggle_actor_selected"
import { GeometryCache } from "../../model/geometry/GeometryCache"
import { Vector } from "../../model/Vector"
import { IRenderer } from "../../render/IRenderer"
import { AppController } from "../AppController"
import { ICommandInfoV2 } from "../command"
import { create_interaction } from "./create-interaction"
import { Interaction } from "./Interaction"
import {  InteractionRenderState } from "./InteractionRenderState"

export class InteractionController {

    command_info: ICommandInfoV2;
    args: unknown[];
    arg_index = 0;
    interaction: Interaction;

    private _interaction_geometry_cache = new GeometryCache()

    constructor(private controller: AppController) {

    }

    interactively_execute(command_info: ICommandInfoV2): void {
        this.command_info = command_info
        this.args = []
        this.args.length = command_info.args?.length ?? 0
        this.arg_index = 0
        this.try_complete_execution();
    }

    try_complete_execution(): void {
        if (!this.command_info) {
            return // no command to exec
        }
        if (this.interaction?.finished) {
            // finalize completed interaction
            this.args[this.arg_index] = this.interaction.result
            this.interaction = null
            this.arg_index += 1
        }
        if (this.arg_index >= this.args.length) {
            // execute the command
            this.controller.execute(this.command_info, ...this.args)
            this.command_info = null
            return
        }
        // need more args
        if (this.interaction == null) {
            const type = this.command_info.args[this.arg_index].interaction_type
            this.interaction = create_interaction(type)
        }
    }

    pointer_click(canvas_x: number, canvas_y: number, renderer: IRenderer, ctrl: boolean): void {
        if (!this.interaction) {
            this.default_interaction(canvas_x, canvas_y, renderer, ctrl)
        } else {
            const [vector, is_snap] = this.get_pointer_world_position(canvas_x, canvas_y, renderer)
            this.interaction.set_pointer_world_location(vector, renderer.get_view_mode())
            this.interaction.pointer_click()
            this.try_complete_execution()
        }
    }

    default_interaction(canvas_x: number, canvas_y: number, renderer: IRenderer, ctrl: boolean): void {
        const controller = this.controller
        const state = controller.state_signal.value
        const vertex_mode = state.vertex_mode
        if (vertex_mode) {
            const [actor, vertexIndex] = renderer.findNearestVertex(state.map, canvas_x, canvas_y)
            if (ctrl) {
                controller.execute(select_toggle_vertex_command, actor, vertexIndex)
            } else {
                controller.execute(select_vertex_command, actor, vertexIndex)
            }
        } else {
            const actor = renderer.findNearestActor(state.map, canvas_x, canvas_y)
            if (ctrl) {
                controller.execute(toggle_actor_selected_command, actor)
            } else {
                controller.execute(make_actor_selection_command, actor)
            }
        }
    }

    pointer_move(canvas_x: number, canvas_y: number, renderer: IRenderer): void {
        if (this.interaction) {
            const [vector, is_snap] = this.get_pointer_world_position(canvas_x, canvas_y, renderer)
            this.interaction.set_pointer_world_location(vector, renderer.get_view_mode())
            this.args[this.arg_index] = this.interaction.result
            const interaction_render_state : InteractionRenderState = { 
                ...this.interaction.render_state, 
                snap_location: is_snap ? vector : null 
            }

            this.controller.preview_command_with_interaction(
                interaction_render_state, this.command_info, this.args)
        }

    }

    get_pointer_world_position(canvas_x: number, canvas_y: number, renderer: IRenderer): [Vector, boolean] {

        const state = this.controller.current_state
        
        // interaction uses a custom geometry cache, so geometry queries are made against the same state
        // instead of making them with the preview state
        this._interaction_geometry_cache.actors = state.map.actors

        const [vector, distance]
            = renderer.find_nearest_snapping_point(state.map, canvas_x, canvas_y, this._interaction_geometry_cache)
        if (vector && distance < 16){
            return [vector, true]
        }
        return [renderer.get_pointer_world_location(canvas_x, canvas_y), false]
    }

}