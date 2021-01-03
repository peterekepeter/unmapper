import { editor_state_from_actors } from "../../model/EditorState";
import * as toggle_vertex_mode from '../toggle_vertex_mode';


test('can toggle vertex mode', () => {

    const state_0 = editor_state_from_actors([]);

    expect(state_0.vertex_mode).toBe(false);

    const state_1 = toggle_vertex_mode.implementation(state_0);

    expect(state_0.vertex_mode).toBe(false);
    expect(state_1.vertex_mode).toBe(true);

    const state_2 = toggle_vertex_mode.implementation(state_1);

    expect(state_0.vertex_mode).toBe(false);
    expect(state_1.vertex_mode).toBe(true);
    expect(state_2.vertex_mode).toBe(false);

})