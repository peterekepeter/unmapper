import { make_actor_selection_command } from "../../commands/selection/make_actor_selection"
import { select_toggle_vertex_command } from "../../commands/selection/select_toggle_vertex"
import { select_vertex_command } from "../../commands/selection/select_vertex"
import { toggle_actor_selected_command } from "../../commands/selection/toggle_actor_selected"
import { IRenderer } from "../../render/IRenderer"
import { AppController } from "../AppController"

export class InteractionController {

    constructor(private controller: AppController) {

    }

    pointer_click(canvas_x: number, canvas_y: number, renderer: IRenderer, ctrlKey: boolean): void {
        const controller = this.controller
        const state = controller.state_signal.value
        const vertex_mode = state.vertex_mode
        if (vertex_mode) {
            const [actor, vertexIndex] = renderer.findNearestVertex(state.map, canvas_x, canvas_y)
            if (ctrlKey) {
                controller.execute(select_toggle_vertex_command, actor, vertexIndex)
            } else {
                controller.execute(select_vertex_command, actor, vertexIndex)
            }
        } else {
            const actor = renderer.findNearestActor(state.map, canvas_x, canvas_y)
            if (ctrlKey) {
                controller.execute(toggle_actor_selected_command, actor)
            } else {
                controller.execute(make_actor_selection_command, actor)
            }
        }
    }

    pointer_move(canvas_x: number, canvas_y: number, renderer:IRenderer): void {
        console.log('interaction move', canvas_x, canvas_y)
    }


}