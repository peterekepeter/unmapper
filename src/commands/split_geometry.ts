import { ICommandInfoV2 } from "../controller/command"
import { EditorState } from "../model/EditorState"
import { change_selected_brushes } from "../model/state"
import { clip_brush_geometry, get_world_plane_from_interaction_buffer } from "./clip_geometry"

export const split_geometry_command: ICommandInfoV2 = {
    description: "Split geometry",
    shortcut: "k",
    exec: exec_split_geometry,
    uses_interaction_buffer: true,
}

function exec_split_geometry(state: EditorState): EditorState {
    console.log('called with state', state);
    const world_plane = get_world_plane_from_interaction_buffer(state.interaction_buffer);
    if (!world_plane || isNaN(world_plane.distance)) {
        console.log('no plane')
        return state
    }
    const inv_world_plane = world_plane.flip();
    
    return change_selected_brushes(state, (b,a,s) => {
        return [
            clip_brush_geometry(b,a,s,world_plane),
            clip_brush_geometry(b,a,s,inv_world_plane),
        ]
    })
}
