import { Actor } from "../../model/Actor";
import { editor_state_from_actors } from "../../model/EditorState";
import { toggle_actor_selected_command } from "../toggle_actor_selected"


test('can toggle selected property', () => {
    const actor = new Actor();
    const prev_state = editor_state_from_actors([actor]);
    const next_state = toggle_actor_selected_command.exec(prev_state, actor);
    expect(prev_state.map.actors[0].selected).toBe(false);
    expect(next_state.map.actors[0].selected).toBe(true);
})