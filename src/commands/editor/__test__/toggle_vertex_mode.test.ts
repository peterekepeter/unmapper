import { editor_state_from_actors } from "../../../model/EditorState"
import { toggle_vertex_mode_command as command } from "../toggle_vertex_mode"


test('can toggle vertex mode', () => {

    const state_0 = editor_state_from_actors([])

    expect(state_0.options.vertex_mode).toBe(false)

    const state_1 = command.exec(state_0)

    expect(state_0.options.vertex_mode).toBe(false)
    expect(state_1.options.vertex_mode).toBe(true)

    const state_2 = command.exec(state_1)

    expect(state_0.options.vertex_mode).toBe(false)
    expect(state_1.options.vertex_mode).toBe(true)
    expect(state_2.options.vertex_mode).toBe(false)

})