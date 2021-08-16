import { Actor } from "../../../model/Actor"
import { editor_state_from_actors } from "../../../model/EditorState"
import { is_null_or_empty } from "../../../util/is_null_or_empty"
import { toggle_actor_selected_command } from "../toggle_actor_selected"

test('can toggle selected property', () => {
    const actor = new Actor()
    const prev_state = editor_state_from_actors([actor])
    const next_state = toggle_actor_selected_command.exec(prev_state, actor)
    expect(is_null_or_empty(prev_state.selection.actors)).toBe(true)
    expect(next_state.selection.actors).toHaveLength(1)
    expect(next_state.selection.actors[0].actor_index).toBe(0)
})
