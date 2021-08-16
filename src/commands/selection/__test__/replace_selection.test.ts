import { Actor } from "../../../model/Actor"
import { BrushModelBuilder } from "../../../model/BrushModelBuilder"
import { create_actor_selection, DEFAULT_EDITOR_SELECTION } from "../../../model/EditorSelection"
import { create_initial_editor_state, EditorState } from "../../../model/EditorState"
import { KnownClasses } from "../../../model/KnownClasses"
import { replace_selection } from "../replace_selection"

let initial_state : EditorState

describe("in object mode", () => {

    beforeAll(() => {
        initial_state = setup_state({ vertex_mode: false })
    })

    test("actor selection is replaced", () => {
        let state = initial_state
        state = replace_selection(state, { actors: [create_actor_selection(0)] })
        expect(state.selection.actors.map(a => a.actor_index)).toEqual([0])
        state = replace_selection(state, { actors: [create_actor_selection(1)] })
        expect(state.selection.actors.map(a => a.actor_index)).toEqual([1])
        state = replace_selection(state, { actors: [0, 1].map(create_actor_selection) })
        expect(state.selection.actors.map(a => a.actor_index)).toEqual([0, 1])
    })

})

describe("in vertex mode", () => {

    beforeAll(() => {
        initial_state = setup_state({ vertex_mode: true })
    })

    test("actor selection is not changed", () => {
        let state = initial_state
        expect(state.selection.actors.map(a => a.actor_index)).toEqual([0])
        state = replace_selection(state, { actors: [create_actor_selection(1)] })
        expect(state.selection.actors.map(a => a.actor_index)).toEqual([0])
    })

})

function setup_state(options: { vertex_mode: boolean }): EditorState {
    const builder = new BrushModelBuilder()
    builder.add_vertex_coords(0, 0, 0)
    builder.add_vertex_coords(1, 0, 0)
    builder.add_vertex_coords(1, 1, 0)
    builder.add_vertex_coords(0, 1, 0)
    builder.add_polygon(0, 1, 2)
    builder.add_polygon(0, 2, 3)
    const triangle = builder.build()
    const actor = new Actor()
    actor.brushModel = triangle
    actor.className = KnownClasses.Brush
    actor.name = 'Brush0'
    const actor2 = new Actor()
    actor.name = "Light0"
    actor.className = KnownClasses.Light
    const default_state = create_initial_editor_state()
    const state: EditorState = {
        ...default_state,
        map: { actors: [actor, actor2] },
        options: {
            ...default_state.options,
            vertex_mode: options.vertex_mode,
        },
        selection: options.vertex_mode 
            ? { actors: [ create_actor_selection(0) ] }
            : DEFAULT_EDITOR_SELECTION,
    }
    return state
}
