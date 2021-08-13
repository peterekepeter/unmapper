import { Actor } from "../../model/Actor"
import { BrushModelBuilder } from "../../model/BrushModelBuilder"
import { create_actor_selection } from "../../model/EditorSelection"
import { editor_state_from_actors } from "../../model/EditorState"
import { delete_selected_command as command } from '../delete_selected'


describe('actors are deleted', () => {
    const actor_0 = new Actor()
    actor_0.name = 'Actor0'
    const actor_1 = new Actor()
    actor_1.name = 'Actor1'
    const prev_state = editor_state_from_actors([actor_0, actor_1])
    prev_state.selection = {
        actors: [create_actor_selection(0)]
    }
    const next_state = command.exec(prev_state)

    test('only 1 actor should remain', () => 
        expect(next_state.map.actors).toHaveLength(1))

    test('Actor1 remains which was not selected', () => 
        expect(next_state.map.actors[0].name).toBe(actor_1.name))
})


describe('vertexes are deleted', () => {
    const actor = new Actor()
    const builder = new BrushModelBuilder()
    builder.add_vertex_coords(0,0,0)
    builder.add_vertex_coords(1,0,0)
    actor.brushModel = builder.build()

    const prev_state = editor_state_from_actors([actor])
    prev_state.selection = {
        actors: [{
            ...create_actor_selection(0),
            vertexes: [1]
        }]
    }
    prev_state.options.vertex_mode = true

    const next_state = command.exec(prev_state)

    test('only 1 vertex should remain', () => 
        expect(next_state.map.actors[0].brushModel.vertexes).toHaveLength(1))
})