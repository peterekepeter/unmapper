import { ICommandInfoV2 } from "../controller/command_registry";
import { change_selected_actors } from "../model/algorithms/common";
import { EditorState } from "../model/EditorState";


export const edit_property_command : ICommandInfoV2 = {
    description: "Edit Object Property",
    exec: implementation
}

export function implementation(state : EditorState, name: string, value: unknown) : EditorState {
    return edit_property(state, name, value);
}

export function edit_property(state : EditorState, name: string, value: unknown) : EditorState {
    return change_selected_actors(state, actor => 
        actor.set_property_immutable(name, value))
}