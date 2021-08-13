import { Actor } from "../../model/Actor"
import { create_actor_selection } from "../../model/EditorSelection"
import { editor_state_from_actors } from "../../model/EditorState"
import { Vector } from "../../model/Vector"
import { edit_property_command } from "../edit_property"


test('does nothing if no object is selected', () => {
    const prev_state = editor_state_from_actors([new Actor()])
    const next_state = edit_property_command.exec(prev_state, "Location", new Vector(0,1,2))
    expect(prev_state).toBe(next_state)
})

test('changes properties of selected objects', () => {
    const actor = new Actor()
    const prev_state = editor_state_from_actors([actor])
    prev_state.selection = {
        actors: [create_actor_selection(0)]
    }
    const next_state = edit_property_command.exec(prev_state, "Location", new Vector(0,1,2))
    expect(prev_state).not.toBe(next_state)
    expect(next_state.map.actors[0].location).toStrictEqual(new Vector(0,1,2))
})