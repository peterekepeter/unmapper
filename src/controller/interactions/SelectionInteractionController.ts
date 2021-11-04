import { toggle_box_select_command } from "../../commands/editor/toggle_box_select"
import { make_actor_selection_command } from "../../commands/selection/make_actor_selection"
import { replace_selection_command } from "../../commands/selection/replace_selection"
import { toggle_actor_selected_command } from "../../commands/selection/toggle_actor_selected"
import { toggle_selection_command } from "../../commands/selection/toggle_selection"
import { BoundingBox } from "../../model/BoundingBox"
import { create_actor_selection, EditorSelection } from "../../model/EditorSelection"
import { GeometryCache } from "../../model/geometry/GeometryCache"
import { ViewportEvent } from "../../model/ViewportEvent"
import { AllViewportQueries } from "../../render/query/AllViewportQueries"
import { AppController } from "../AppController"
import { ICommandInfoV2 } from "../command"
import { InteractionRenderState } from "./InteractionRenderState"

export class SelectionInteractionController
{
    
    constructor(
        private controller: AppController,
        private _interaction_geometry_cache: GeometryCache,
        private _viewport_queries: AllViewportQueries,
    ) {

    }

    box_selection(first: ViewportEvent, event: ViewportEvent, final: boolean): void {

        const min_x = Math.min(event.canvas_x, first.canvas_x)
        const min_y = Math.min(event.canvas_y, first.canvas_y)
        const max_x = Math.max(event.canvas_x, first.canvas_x)
        const max_y = Math.max(event.canvas_y, first.canvas_y)
        const state = this.controller.state_signal.value
        this._interaction_geometry_cache.actors = state.map.actors
        this._viewport_queries.mode = event.view_mode
        this._viewport_queries.render_transform = event.view_transform

        const selection: EditorSelection = state.options.vertex_mode
            ? this._viewport_queries.find_vertexes_of_selected_actors_in_box(state, min_x, min_y, max_x, max_y, this._interaction_geometry_cache)
            : { actors: this._viewport_queries.find_actors_in_box(state.map, min_x, min_y, max_x, max_y).map(i => create_actor_selection(i)) }
        const command: ICommandInfoV2 = { exec: s=>({ ...s, selection }) }
        if (!final) {
            const interaction_render_state: InteractionRenderState = {
                viewport_box_index: event.viewport_index,
                viewport_box: new BoundingBox({ min_x, min_y, max_x, max_y }),
            }
            this.controller.preview_command_with_interaction(interaction_render_state, command, []) 
        } else {
            this.controller.execute(command)
            this.controller.execute(toggle_box_select_command, false)
        }
    }

    point_selection(event: ViewportEvent): void {
        const controller = this.controller
        const state = controller.state_signal.value
        const vertex_mode = state.options.vertex_mode
        this._interaction_geometry_cache.actors = state.map.actors
        this._viewport_queries.mode = event.view_mode
        this._viewport_queries.render_transform = event.view_transform
        if (vertex_mode) {
            this.point_select_in_vertex_mode(event)
        } else {
            const query = this._viewport_queries.query_point(state, event.canvas_x, event.canvas_y)
            const actor = query.selection?.actors[0]?.actor_index
            if (event.ctrl_key) {
                controller.execute(toggle_actor_selected_command, actor)
            } else {
                controller.execute(make_actor_selection_command, actor)
            }
        }
    }

    point_select_in_vertex_mode(event: ViewportEvent): void {
        const controller = this.controller
        const state = controller.state_signal.value

        if (!state.options.vertex_mode){
            throw new Error("expected to only be called in vertex mode")
        }
        
        this._interaction_geometry_cache.actors = state.map.actors
        this._viewport_queries.mode = event.view_mode
        this._viewport_queries.render_transform = event.view_transform

        const selection = this._viewport_queries.find_selection_at_point(state, event.canvas_x, event.canvas_y)

        const command = event.ctrl_key 
            ? toggle_selection_command
            : replace_selection_command

        controller.execute(command, selection)
    }

    point_select_in_object_mode(event: ViewportEvent): void {
        const controller = this.controller
        const state = controller.state_signal.value

        if (state.options.vertex_mode){
            throw new Error("expected to never be called in vertex mode")
        }

        const actor = this._viewport_queries.find_nearest_actor(state.map, event.canvas_x, event.canvas_y)

        const command = event.ctrl_key 
            ? toggle_actor_selected_command
            : make_actor_selection_command
            
        controller.execute(command, actor)
    }
}
