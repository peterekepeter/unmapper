import { confirm_interaction_point_command } from "../../commands/interaction/confirm_interaction_point"
import { propose_interaction_point_command } from "../../commands/interaction/propose_interaction_point"
import { reset_interaction_buffer_command } from "../../commands/interaction/reset_interaction_buffer"
import { DEFAULT_INTERACTION_BUFFER } from "../../model/InteractionBuffer"
import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { ViewportMode } from "../../model/ViewportMode"
import { ViewportPointQueryResult } from "../../render/query/ViewportPointQueryResult"
import { AppController } from "../AppController"
import { ICommandInfoV2 } from "../command"
import { InteractionRenderState } from "./InteractionRenderState"

export class BufferedInteractionController
{
    private command_info: ICommandInfoV2
    private last_move_vector: Vector;
    private last_move_mode: ViewportMode;

    get has_interaction(): boolean {
        return this.command_info != null
    }

    constructor(private controller: AppController){
        
    }

    next_command(command_info: ICommandInfoV2): void {
        if (this.command_info != null){
            // finalize previous command
            this.controller.reset_preview()
            try
            {
                this.controller.execute(this.command_info)
            }
            catch (e){
                // previous command can be a failing command
                // in case it fails just log it and let the app recover
                console.error(e)
            }
            this.controller.execute(reset_interaction_buffer_command)
        }

        // next command
        this.command_info = command_info

        if (this.command_info != null){
            const buffer = this.controller.current_state.interaction_buffer
            // start off next command with 1 point
            if (buffer.points.length === 1)
            {
                this.controller.execute(confirm_interaction_point_command, buffer.points[0], buffer.viewport_mode)
            }
            else if (this.last_move_vector){
                this.controller.execute(confirm_interaction_point_command, this.last_move_vector, this.last_move_mode)
            }
            else {
                // no first point :(
            }
        }
    }

    handle_pointer_click(query: ViewportPointQueryResult, event: ViewportEvent): void {
        this.controller.execute(confirm_interaction_point_command, query.location, event.view_mode)
        this.preview_current_command(query)

        // if command resets the interaction buffer that means should be finalized
        if (this.controller.state_signal.value.interaction_buffer === DEFAULT_INTERACTION_BUFFER){
            this.next_command(null)
        }
    }

    handle_pointer_move(query: ViewportPointQueryResult, event: ViewportEvent): void {
        this.controller.execute(propose_interaction_point_command, query.location, event.view_mode)
        this.preview_current_command(query)
        this.last_move_mode = event.view_mode
        this.last_move_vector = query.location
    }

    private preview_current_command(query: ViewportPointQueryResult) {
        const interaction = this.get_interaction_render_state(query)
        if (this.has_interaction) {
            this.controller.preview_command_with_interaction(interaction, this.command_info, [])
        } else {
            this.controller.preview_interaction_state(interaction)
        }
    }

    private get_interaction_render_state(query: ViewportPointQueryResult): InteractionRenderState {
        const snap = query.snap
        switch(snap.type){
            case "None": 
                return { shapes: [{ type: "Point", shape: 'TinyDot', location: query.location }] }
            case "Vertex": 
                return { shapes: [{ type: "Point", shape: 'Rectangle', location: query.location }] }
            case "Edge":
                return {
                    shapes: [
                        { type: "Point", shape: "SmallDot", location: query.location },
                        { type: "Line", from: snap.vertex_a, to: snap.vertex_b },
                    ], 
                }
            
            case "EdgeMidpoint":
                return {
                    shapes: [
                        { type: "Point", shape: "Dot", location: query.location },
                        { type: "Line", from: snap.vertex_a, to: snap.vertex_b },
                    ], 
                }
            
            case "LineIntersection":
                return {
                    shapes: [
                        { type: "Point", shape: "X", location: query.location },
                        { type: "Line", from: snap.line_a_0, to: snap.line_a_1 },
                        { type: "Line", from: snap.line_b_0, to: snap.line_b_1 },
                    ], 
                }
            case "LineRightAngle":
                return {
                    shapes: [
                        { type: "Point", shape: "Dot", location: query.location },
                        { type: "Line", from: snap.line_0, to: snap.line_1 },
                        { type: "Line", shape: "Arrow", from: snap.from, to: query.location },
                    ], 
                }
                
            default: 
                return { shapes: [{ type: "Point", shape: "SmallDot", location: query.location }] }
                
        }
    }
    
}
