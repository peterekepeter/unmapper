import { add_interaction_point_command } from "../../commands/interaction/add_interaction_point"
import { Vector } from "../../model/Vector"
import { ViewportEvent } from "../../model/ViewportEvent"
import { AppController } from "../AppController"
import { ICommandInfoV2 } from "../command"

export class BufferedInteractionController
{
    private command_info: ICommandInfoV2

    get has_interaction(): boolean {
        return this.command_info != null
    }

    constructor(private controller: AppController){
        
    }

    next_command(command_info: ICommandInfoV2) {
        this.command_info = command_info
    }

    handle_pointer_click(vector: Vector, event: ViewportEvent) {
        this.controller.execute(add_interaction_point_command, vector, event.view_mode)
    }

    handle_pointer_move(vector: Vector, event: ViewportEvent, is_snap: boolean) {
        throw new Error("Method not implemented.")
        
    }

}
