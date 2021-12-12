
import { Actor } from "../../model/Actor"
import { BrushModelBuilder } from "../../model/BrushModelBuilder"
import { DEFAULT_ACTOR_SELECTION } from "../../model/EditorSelection"
import { create_initial_editor_state, editor_state_from_actors, EditorState } from "../../model/EditorState"
import { Vector } from "../../model/Vector"
import { extrude_polygons_command as command } from "../extrude_polygons"

// DEBUG polygon creation
describe.skip('extrude polygon', () => {

    const builder = new BrushModelBuilder()
    builder.add_vertex_coords(0, 0, 0)
    builder.add_vertex_coords(1, 0, 0)
    builder.add_vertex_coords(1, 1, 0)
    builder.add_vertex_coords(0, 1, 0)
    builder.add_polygon(0, 1, 2, 3)
    const actor = new Actor()
    actor.brushModel = builder.build()
    
    const initial = create_initial_editor_state()
    const old_state: EditorState = { 
        ...editor_state_from_actors([actor]),
        options: { 
            ...initial.options,
            vertex_mode: true, 
        },
        selection: {
            actors: [
                {
                    ...DEFAULT_ACTOR_SELECTION,
                    actor_index: 0,
                    polygons: [0],
                },
            ], 
        },
        interaction_buffer: {
            ...initial.interaction_buffer,
            points: [Vector.ZERO, Vector.UP], 
        },
    }
    
    let new_state : EditorState

    beforeAll(() => {
        new_state = command.exec(old_state)
    })

    test('new state gets returned', () =>
        expect(new_state).not.toBe(old_state))

    test('new state is not null', () =>
        expect(new_state).not.toBeNull())

    test('old state has 1 polygons', () => 
        expect(old_state.map.actors[0].brushModel.polygons.length).toBe(1))

    test('new state has 5 polygons', () => 
        expect(new_state.map.actors[0].brushModel.polygons.length).toBe(5))

})
