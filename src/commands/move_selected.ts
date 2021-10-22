import { ICommandInfoV2 } from "../controller/command"
import { get_selected_uv_vertex_list } from "../model/algorithms/get_selected_uv_vertex_list"
import { get_selected_vertex_list } from "../model/algorithms/get_selected_vertex_list"
import { update_polygon_median_normal } from "../model/algorithms/update_polygon_median_normal"
import { BrushVertex } from "../model/BrushVertex"
import { complete_interaction, EditorState } from "../model/EditorState"
import { get_world_to_actor_rotation_scaling } from "../model/geometry/actor-space-transform"
import { InteractionBuffer } from "../model/InteractionBuffer"
import { change_selected_actors, change_selected_brushes } from "../model/state"
import { get_brush_polygon_vertex_uvs, set_brush_polygon_vertex_uvs } from "../model/uvmap/vertex_uv"
import { Vector } from "../model/Vector"
import { ViewportMode } from "../model/ViewportMode"

export const move_command: ICommandInfoV2 = {
    description: 'Move objects or vertexes',
    shortcut: 'g',
    uses_interaction_buffer: true,
    exec: move_selected,
}

export function move_selected(state: EditorState): EditorState {
    const motion = get_motion_vector(state.interaction_buffer)
    let next: EditorState
    if (motion.equals(Vector.ZERO)){
        return state
    }
    if (state.options.vertex_mode){
        if (state.interaction_buffer.viewport_mode === ViewportMode.UV) {
            next = move_selected_uv_vertexes(state, motion)
        }
        else {
            next = move_selected_vertexes(state, motion)
        }
    } else {
        next = move_selected_actors(state, motion)
    }
    if (state.interaction_buffer.points.length >= 2) {
        next = complete_interaction(next)
    }
    return next
}

function move_selected_actors(state: EditorState, motion: Vector): EditorState {
    return change_selected_actors(state, a => {
        const new_obj = a.shallow_copy()
        new_obj.location = a.location.add_vector(motion)
        return new_obj
    })
}

function move_selected_vertexes(state: EditorState, motion: Vector): EditorState {
    return change_selected_brushes(state, (b, a, s) => {
        const matrix = get_world_to_actor_rotation_scaling(a)
        const vertex_motion = matrix.apply(motion)
        const vertex_list = get_selected_vertex_list(a, s, {
            edge_to_vertex: true, 
            polygon_to_vertex: true,
        })
        let new_brush = b.shallow_copy()
        new_brush.vertexes = new_brush.vertexes.map((v, i) => vertex_list.indexOf(i) === -1 ? v 
            : new BrushVertex(v.position.add_vector(vertex_motion)))
        if (state.options.preserve_vertex_uv){
            for (let i=0; i<b.polygons.length; i++){
                const uvs = get_brush_polygon_vertex_uvs(b, i)
                new_brush = set_brush_polygon_vertex_uvs(new_brush, i, uvs)
            }
        }
        new_brush.polygons = new_brush.polygons
            .map(polygon => update_polygon_median_normal(new_brush.vertexes, polygon))
        return new_brush
    })
}

function get_motion_vector(interaction_buffer: InteractionBuffer) {
    let motion = Vector.ZERO
    for (let i=1; i<interaction_buffer.points.length; i+= 2)
    {
        const from = interaction_buffer.points[i-1]
        const to = interaction_buffer.points[i]
        motion = motion.add_vector(to.subtract_vector(from))
    }
    const x = interaction_buffer.axis_lock.x_axis ? 0 : 1
    const y = interaction_buffer.axis_lock.y_axis ? 0 : 1
    const z = interaction_buffer.axis_lock.z_axis ? 0 : 1
    
    if (interaction_buffer.scalar != null){
        if (motion.equals(Vector.ZERO)){
            motion = new Vector(x, y, z)
        } else {
            motion = motion.scale_components(new Vector(x, y, z))
        }
        motion = motion.normalize().scale(interaction_buffer.scalar.value)
    } else {
        motion = motion.scale_components(new Vector(x, y, z))
    }
    
    return lock_motion_to_viewport(motion, interaction_buffer.viewport_mode)
}

function lock_motion_to_viewport(vector: Vector, view_mode: ViewportMode): Vector {
    switch (view_mode){
        case ViewportMode.Top:
        case ViewportMode.UV: 
            return vector.scale_components(Vector.UNIT_X.add_vector(Vector.UNIT_Y))
        case ViewportMode.Front: 
            return vector.scale_components(Vector.UNIT_Y.add_vector(Vector.UNIT_Z))
        case ViewportMode.Side: 
            return vector.scale_components(Vector.UNIT_X.add_vector(Vector.UNIT_Z))
        case ViewportMode.Perspective:
            return vector
        default: 
            throw new Error('not implemented')
    }
}

function move_selected_uv_vertexes(state: EditorState, motion: Vector): EditorState {
    return change_selected_brushes(state, (brush, actor, selection) => {
        
        for (const poly of selection.polygon_vertexes){
            const uvs = get_brush_polygon_vertex_uvs(brush, poly.polygon_index)
            const uv_vertexes = get_selected_uv_vertex_list(actor, poly, { edge_to_vertex: true })
            for (const vertex_index of uv_vertexes){
                uvs[vertex_index] = uvs[vertex_index].add_vector(motion)
            }
            brush = set_brush_polygon_vertex_uvs(brush, poly.polygon_index, uvs)
        }
        return brush
    })
}

