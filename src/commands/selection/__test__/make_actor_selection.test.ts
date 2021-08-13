import { Actor } from "../../../model/Actor"
import { editor_state_from_actors } from "../../../model/EditorState"
import { make_actor_selection_command } from "../make_actor_selection"


test('can change selection to only the given actor', () => {
    const actor_a = new Actor()
    const actor_b = new Actor()
    const state_0 = editor_state_from_actors([actor_a, actor_b])

    // first select
    const state_1 = make_actor_selection_command.exec(state_0, state_0.map.actors[0])
    expect(state_0.selection).not.toEqual(state_1.selection)
    expect(state_1.selection.actors[0].actor_index).toBe(0)

    // second select
    const state_2 = make_actor_selection_command.exec(state_1, state_1.map.actors[1])
    expect(state_1.selection).not.toEqual(state_2.selection)
    expect(state_2.selection.actors[0].actor_index).toBe(1)
})

test('throws error if actor is from wrong state', () => {
    
    const actor_a = new Actor()
    const actor_b = new Actor()
    const state_0 = editor_state_from_actors([actor_a])

    const state_1 = make_actor_selection_command.exec(state_0, actor_a)
    expect(() => make_actor_selection_command.exec(state_1, actor_b)).toThrow()
    
})