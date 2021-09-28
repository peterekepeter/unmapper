import { add_interaction_point_command } from "../../commands/interaction/add_interaction_point"
import { replace_last_interaction_point_command } from "../../commands/interaction/replace_last_interaction_point"
import { reset_interaction_buffer_command } from "../../commands/interaction/reset_interaction_buffer"
import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { AppController } from "../AppController"
import { ICommandInfoV2 } from "../command"
import { InteractionRenderState } from "./InteractionRenderState"

export class BufferedInteractionController
{
    private command_info: ICommandInfoV2

    get has_interaction(): boolean {
        return this.command_info != null
    }

    constructor(private controller: AppController){
        
    }

    next_command(command_info: ICommandInfoV2): void {
        if (this.command_info != null){
            this.controller.execute(this.command_info)
            this.controller.execute(reset_interaction_buffer_command)
        }
        this.command_info = command_info
    }

    handle_pointer_click(vector: Vector, event: ViewportEvent, is_snap: boolean): void {
        this.controller.execute(add_interaction_point_command, vector, event.view_mode)
        this.preview_current_command(vector, is_snap)
    }

    handle_pointer_move(vector: Vector, event: ViewportEvent, is_snap: boolean): void {
        this.controller.execute(replace_last_interaction_point_command, vector, event.view_mode)
        this.preview_current_command(vector, is_snap)
    }
    private preview_current_command(vector: Vector, is_snap: boolean) {
        const state = this.get_interaction_render_state(vector, is_snap)
        this.controller.preview_command_with_interaction(state, this.command_info, [])
    }

    private get_interaction_render_state(vector: Vector, is_snap: boolean): InteractionRenderState {
        return { snap_location: is_snap ? vector : null }
    }
    
}
