import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { EditorError } from "../model/error"
import { get_actor_to_world_transform_optimized, get_world_to_actor_rotation_scaling, get_world_to_actor_transform } from "../model/geometry/actor-space-transform"
import { change_selected_actors, change_selected_brushes } from "../model/state"
import { change_selected_vertexes } from "../model/state_updates/change_selected_vertexes"
import { Vector } from "../model/Vector"
import { ViewportMode } from "../model/ViewportMode"


export const merge_points_command: ICommandInfoV2 = {
    description: 'Merge points',
    shortcut: 'alt + m',
    uses_interaction_buffer: true,
    exec: merge_selected_points,
}


function merge_selected_points(state: EditorState): EditorState {
    EditorError.if(!state.options.vertex_mode, "To merge points you should be in vertex mode")
    const average = calculate_average_vertex_position(state)
    return move_selected_vertexes_to_world_position(state, average)
}

function calculate_average_vertex_position(state: EditorState): Vector {
    let x = 0, y=0, z=0, c=0
    for (const selected_actor of state.selection.actors){
        const actor = state.map.actors[selected_actor.actor_index]
        const brush = actor.brushModel
        if (!brush){
            continue
        }
        const vertex_fn = get_actor_to_world_transform_optimized(actor)
        for (const selected_vertex of selected_actor.vertexes){
            const model_vertex = brush.vertexes[selected_vertex]
            const vertex = vertex_fn(model_vertex.position)
            x+=vertex.x
            y+=vertex.y
            z+=vertex.z
        }
        c+=selected_actor.vertexes.length
    }
    EditorError.if(c == 0, "Cannot calculate vertex average when no vertex is selected")
    return new Vector(x/c, y/c, z/c)
}

function move_selected_vertexes_to_world_position(state: EditorState, world_position: Vector): EditorState {
    return change_selected_actors(state, (a, as) => {
        if (!a.brushModel){
            return a
        }
        const vertex_fn = get_world_to_actor_transform(a)
        const model_position = vertex_fn(world_position)   
        const view_vector = view_mode_to_vector(state.interaction_buffer.viewport_mode)
        if (view_vector !== Vector.ZERO){
            // cancel out movement in direction of viewport
            const normal_matrix = get_world_to_actor_rotation_scaling(a)
            const view_direction = normal_matrix.apply(view_vector).normalize()
            return change_selected_vertexes(a, as.vertexes, v => {
                const v_to_position = v.vector_to_vector(model_position)
                const move = v_to_position.subtract_vector(view_direction.scale(v_to_position.dot(view_direction)))
                return v.add_vector(move)
            })

        }
        return change_selected_vertexes(a, as.vertexes, () => model_position)
    })
}

function view_mode_to_vector(mode: ViewportMode): Vector {
    switch(mode){
        case ViewportMode.Top:
        case ViewportMode.UV:
            return Vector.UP
        case ViewportMode.Front:
            return Vector.FORWARD
        case ViewportMode.Side:
            return Vector.RIGHT
    }
    return Vector.ZERO
}
