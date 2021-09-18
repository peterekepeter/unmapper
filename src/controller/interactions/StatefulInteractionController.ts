import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { AppController } from "../AppController"
import { ICommandInfoV2 } from "../command"
import { InteractionRenderState } from "./InteractionRenderState"
import { StatefulInteraction } from "./stateful/StatefulInteraction"

export class StatefulInteractionController {

    command_info: ICommandInfoV2
    args: unknown[];
    arg_index = 0;
    interaction: StatefulInteraction;

    constructor(private controller: AppController){

    }

    get has_interaction(): boolean {
        return this.interaction != null
    }

    handle_pointer_click(vector: Vector, event: ViewportEvent): void {
        this.interaction.set_pointer_world_location(vector, event)
        this.interaction.pointer_click()
        this.try_complete_execution()
    }

    handle_pointer_move(vector: Vector, event: ViewportEvent, is_snap: boolean): void {
        this.interaction.set_pointer_world_location(vector, event)
        this.args[this.arg_index] = this.interaction.result
        const interaction_render_state: InteractionRenderState = {
            ...this.interaction.render_state,
            snap_location: is_snap ? vector : null,
        }

        this.controller.preview_command_with_interaction(interaction_render_state, this.command_info, this.args)
    }

    reset_state(): void {
        this.command_info = null
        this.args = []
        this.arg_index = 0
    }
    
    interactively_execute(command_info: ICommandInfoV2): void {
        this.reset_state()
        this.command_info = command_info
        this.args.length = this.command_info.args?.length ?? 0
        this.try_complete_execution()
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
            const factory = this.command_info.args[this.arg_index].interaction_factory
            this.interaction = factory()
        }
    }
}
