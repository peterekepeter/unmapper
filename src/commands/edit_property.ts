import { change_selected_actors, change_selected_brushes, select_actors } from "../model/algorithms/common";
import { EditorState } from "../model/EditorState";

export const description = "Edit Object Property";

export function implementation(state : EditorState, name: string, value: any) : EditorState {
    return edit_property(state, name, value);
}

export function edit_property(state : EditorState, name: string, value: any) : EditorState {
    return change_selected_actors(state, actor => 
        actor.set_property_immutable(name, value))
}