import { DEFAULT_EDITOR_SELECTION } from "../../model/EditorSelection"
import { NotImplementedError } from "../../model/error/NotImplementedError"
import { GeometryCache } from "../../model/geometry/GeometryCache"
import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { AllViewportQueries } from "../../render/query/AllViewportQueries"
import { DEFAULT_SNAP_RESULT } from "../../render/query/SnapResult"
import { ViewportPointQueryResult } from "../../render/query/ViewportPointQueryResult"
import { AppController } from "../AppController"
import { ICommandInfoV2 } from "../command"
import { BufferedInteractionController } from "./BufferedInteractionController"
import { SelectionInteractionController } from "./SelectionInteractionController"
import { StatefulInteractionController } from "./StatefulInteractionController"

export class InteractionController {

    uses_interaction_buffer: boolean;
    box_select_begin: ViewportEvent;

    private _interaction_geometry_cache = new GeometryCache()
    private _viewport_queries = new AllViewportQueries(this._interaction_geometry_cache);
    private _selection = new SelectionInteractionController(this.controller, this._interaction_geometry_cache, this._viewport_queries);
    private _stateful = new StatefulInteractionController(this.controller)
    private _buffered = new BufferedInteractionController(this.controller)

    constructor(private controller: AppController) {

    }
    
    interactively_execute(command_info: ICommandInfoV2): void {
        this._stateful.reset_state()
        this._buffered.next_command(null)
        if (command_info == null){
            return // noop
        }
        else if (command_info.uses_interaction_buffer){
            console.log('buffered exec', command_info)
            this._buffered.next_command(command_info)
        } 
        else {
            this._stateful.interactively_execute(command_info)
        }
    }

    pointer_up(event: ViewportEvent): void {
        if (this._buffered.has_interaction){
            // buffered interaction
            const query = this.get_viewport_event_world_position(event)
            this._buffered.handle_pointer_click(query, event)
        }
        else if (this._stateful.has_interaction) {
            // stateful interaction
            const query = this.get_viewport_event_world_position(event)
            this._stateful.handle_pointer_click(query, event)
        } else {
            // selection interaction
            if (this.controller.current_state.options.box_select_mode) {
                this._selection.box_selection(this.box_select_begin, event, true)
                this.box_select_begin = null
            } else {
                this._selection.point_selection(event)
            }
        }
    }

    pointer_move(event: ViewportEvent): void {
        if (this._stateful.has_interaction) {
            // stateful interaction
            const query = this.get_viewport_event_world_position(event)
            this._stateful.handle_pointer_move(query, event)
        }
        else if (this.controller.current_state.options.box_select_mode
            && this.box_select_begin != null) {
            // selection interaction
            this._selection.box_selection(this.box_select_begin, event, false)
        } else {
            // by default buffered interaction
            const query = this.get_viewport_event_world_position(event)
            this._buffered.handle_pointer_move(query, event)
        }
    }

    pointer_down(event: ViewportEvent): void {
        if (this.controller.current_state.options.box_select_mode) {
            this._stateful.reset_state()
            this._buffered.next_command(null)
            this.box_select_begin = event
        }
    }

    private get_viewport_event_world_position(event: ViewportEvent): ViewportPointQueryResult {

        const state = this.controller.current_state
        this._viewport_queries.mode = event.view_mode
        this._viewport_queries.render_transform = event.view_transform

        // interaction uses a custom geometry cache, so geometry queries are made against the last non-preview state
        // instead of making them with the preview state which can lead to strange behaviour
        this._interaction_geometry_cache.actors = state.map.actors

        try {
            return this._viewport_queries.query_point(
                state, 
                event.canvas_x,
                event.canvas_y,
                this._interaction_geometry_cache,
            )
        }
        catch (error){
            if (error instanceof NotImplementedError){
                // fallback to legacy implemetnation
                const [vector, distance] = this._viewport_queries.find_nearest_snapping_point(
                    state, 
                    event.canvas_x,
                    event.canvas_y,
                    this._interaction_geometry_cache,
                )
                if (vector && distance < 16) {
                    return {  
                        location: vector, 
                        selection: DEFAULT_EDITOR_SELECTION, 
                        snap: { type: "Legacy" }, 
                    }
                }
                return {
                    location: event.view_transform.canvas_to_world_location(event.canvas_x, event.canvas_y), 
                    selection: DEFAULT_EDITOR_SELECTION, 
                    snap: { type: "None" },
                }
            }
            else {
                throw error // re-throw
            }
        }
        
    }

}
