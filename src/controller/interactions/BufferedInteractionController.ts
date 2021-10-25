import { confirm_interaction_point_command } from "../../commands/interaction/confirm_interaction_point"
import { propose_interaction_point_command } from "../../commands/interaction/propose_interaction_point"
import { reset_interaction_buffer_command } from "../../commands/interaction/reset_interaction_buffer"
import { DEFAULT_INTERACTION_BUFFER } from "../../model/InteractionBuffer"
import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { ViewportMode } from "../../model/ViewportMode"
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
            this.controller.execute(this.command_info)
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

    handle_pointer_click(vector: Vector, event: ViewportEvent, is_snap: boolean): void {
        this.controller.execute(confirm_interaction_point_command, vector, event.view_mode)
        this.preview_current_command(vector, is_snap)

        // if command resets the interaction buffer that means should be finalized
        if (this.controller.state_signal.value.interaction_buffer === DEFAULT_INTERACTION_BUFFER){
            this.next_command(null)
        }
    }

    handle_pointer_move(vector: Vector, event: ViewportEvent, is_snap: boolean): void {
        this.controller.execute(propose_interaction_point_command, vector, event.view_mode)
        this.preview_current_command(vector, is_snap)
        this.last_move_mode = event.view_mode
        this.last_move_vector = vector
    }

    private preview_current_command(vector: Vector, is_snap: boolean) {
        const interaction = this.get_interaction_render_state(vector, is_snap)
        if (this.has_interaction) {
            this.controller.preview_command_with_interaction(interaction, this.command_info, [])
        } else {
            this.controller.preview_interaction_state(interaction)
        }
    }

    private get_interaction_render_state(vector: Vector, is_snap: boolean): InteractionRenderState {
        return { snap_location: is_snap ? vector : null }
    }
    
}
