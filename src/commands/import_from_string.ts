import { ICommandInfoV2 } from "../controller/command_registry";
import { change_actors_list } from "../model/algorithms/common";
import { EditorState } from "../model/EditorState";
import { load_map_from_string } from "../model/loader";

export const import_from_string_command: ICommandInfoV2 = {
    exec: (state: EditorState, str: string) =>
        change_actors_list(state, actor_list => [
            ...actor_list,
            ...load_map_from_string(str).actors
        ])
}
