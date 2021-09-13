import { Actor } from "../../../model/Actor"
import { BrushModelBuilder } from "../../../model/BrushModelBuilder"
import { ActorSelection, create_actor_selection, DEFAULT_ACTOR_SELECTION, DEFAULT_EDITOR_SELECTION, EditorSelection } from "../../../model/EditorSelection"
import { create_initial_editor_state, EditorState } from "../../../model/EditorState"
import { KnownClasses } from "../../../model/KnownClasses"
import { deep_freeze } from "../../../util/deep_freeze"
import { toggle_selection_command } from "../toggle_selection"

let initial_state: EditorState

describe("when not in vertex mode", () => {

    beforeAll(() => {
        initial_state = setup_state({ vertex_mode: false })
        deep_freeze(initial_state)
    })
    
    test("no actor selected initially", () => {
        expect(initial_state.selection.actors).toHaveLength(0)
    })
    
    test("toggles actor selection selects actor", () => {
        const next = toggle(initial_state, { actors: [create_actor_selection(0)] })
        expect(next.selection.actors).toHaveLength(1)
        expect(next.selection.actors[0].actor_index).toBe(0)
    })

    test("toggling twice resets actor selection", () => {
        const first_actor = { actors: [create_actor_selection(0)] }
        const next = toggle(toggle(initial_state, first_actor), first_actor)
        expect(next.selection.actors).toHaveLength(0)
    })

    test("toggle each actor selects all actors", () => {
        const first_actor = { actors: [create_actor_selection(0)] }
        const seconds_actor = { actors: [create_actor_selection(1)] }
        const next = toggle(toggle(initial_state, first_actor), seconds_actor)
        expect(next.selection.actors).toHaveLength(next.map.actors.length)
    })

    test("toggling with empty selection does nothing", () => {
        const next = toggle(initial_state, DEFAULT_EDITOR_SELECTION)
        expect(next).toBe(initial_state)
    })
})

describe("in vertex mode", () => {

    beforeAll(() => {
        initial_state = setup_state({ vertex_mode: true })
        deep_freeze(initial_state)
    })

    test("initial conditions", () => {
        expect(initial_state.selection.actors).toHaveLength(1)
        const actor = initial_state.map.actors[0]
        const brush = actor.brushModel
        expect(brush.vertexes).toHaveLength(4)
        expect(brush.edges).toHaveLength(5)
        expect(brush.polygons).toHaveLength(2)
    })

    test("can select vertex", () => {
        expect(toggle(initial_state, create_selection({ vertexes: [0] }))
            .selection.actors[0].vertexes).toHaveLength(1)
    })

    test("can select multiple vertexes", () => {
        let state = initial_state
        state = toggle(state, create_selection({ vertexes: [0] }))
        state = toggle(state, create_selection({ vertexes: [1] }))
        expect(state.selection.actors[0].vertexes).toEqual([0, 1])
    })

    test("toggling same vertex deselects it", () => {
        let state = initial_state
        state = toggle(state, create_selection({ vertexes: [0] }))
        state = toggle(state, create_selection({ vertexes: [0] }))
        expect(state.selection.actors[0].vertexes).toEqual([])
    })

    test("can select edges", () => {
        expect(toggle(initial_state, create_selection({ edges: [0] }))
            .selection.actors[0].edges).toHaveLength(1)
    })

    test("can select multiple edges", () => {
        let state = initial_state
        state = toggle(state, create_selection({ edges: [0] }))
        state = toggle(state, create_selection({ edges: [1] }))
        expect(state.selection.actors[0].edges).toEqual([0, 1])
    })

    test("toggling same edge deselects it", () => {
        let state = initial_state
        state = toggle(state, create_selection({ edges: [0] }))
        state = toggle(state, create_selection({ edges: [0] }))
        expect(state.selection.actors[0].edges).toEqual([])
    })

    test("can select polygon", () => {
        expect(toggle(initial_state, create_selection({ polygons: [0] }))
            .selection.actors[0].polygons).toHaveLength(1)
    })

    test("can select multiple polygons", () => {
        let state = initial_state
        state = toggle(state, create_selection({ polygons: [0] }))
        state = toggle(state, create_selection({ polygons: [1] }))
        expect(state.selection.actors[0].polygons).toEqual([0, 1])
    })

    test("toggling same polygon deselects it", () => {
        let state = initial_state
        state = toggle(state, create_selection({ polygons: [0] }))
        state = toggle(state, create_selection({ polygons: [0] }))
        expect(state.selection.actors[0].polygons).toEqual([])
    })

    test("toggle selection of multiple components", () => {
        let state = initial_state
        state = toggle(state, create_selection({
            vertexes: [0, 1, 2], 
            polygons: [0, 1],
            edges: [0, 1], 
        }))
        state = toggle(state, create_selection({
            vertexes: [1, 2],
            polygons: [1],
            edges: [1], 
        }))
        expect(state.selection.actors[0]).toMatchObject({
            vertexes: [0], 
            polygons: [0],
            edges: [0],
        })
        state = toggle(state, create_selection({
            vertexes: [0, 1, 2],
            polygons: [0, 1],
            edges: [0, 1], 
        }))
        expect(state.selection.actors[0]).toMatchObject({
            vertexes: [1, 2], 
            polygons: [1],
            edges: [1],
        })
    })

    test("toggle polygon vertex removed from list of it contains no vertexes", () => {
        let state = initial_state
        const selection = create_selection({
            polygon_vertexes: [
                { polygon_index: 0, vertexes: [0, 1, 2], edges: [] },
                { polygon_index: 1, vertexes: [0, 1, 2], edges: [] },
            ], 
        })
        state = toggle(state, selection)
        expect(state.selection.actors[0].polygon_vertexes).toHaveLength(2)
        state = toggle(state, selection)
        expect(state.selection.actors[0].polygon_vertexes).toHaveLength(0)
    })

    test("toggle polygon vertex ", () => {
        let state = initial_state
        state = toggle(state, create_selection(
            { polygon_vertexes: [{ polygon_index: 0, vertexes: [0, 1, 2], edges: [] }] },
        ))
        expect(state.selection.actors[0].polygon_vertexes[0].vertexes).toEqual([0, 1, 2])
        state = toggle(state, create_selection(
            { polygon_vertexes: [ { polygon_index: 0, vertexes: [0, 1], edges: [] }] },
        ))
        expect(state.selection.actors[0].polygon_vertexes[0].vertexes).toEqual([2])
    })

    test("toggle polygon edge ", () => {
        let state = initial_state
        state = toggle(state, create_selection(
            { polygon_vertexes: [{ polygon_index: 0, vertexes: [], edges: [0, 1, 2] }] },
        ))
        expect(state.selection.actors[0].polygon_vertexes[0].edges).toEqual([0, 1, 2])
        state = toggle(state, create_selection(
            { polygon_vertexes: [ { polygon_index: 0, vertexes: [], edges: [0, 1] }] },
        ))
        expect(state.selection.actors[0].polygon_vertexes[0].edges).toEqual([2])
    })

    function create_selection(
        selection: Partial<ActorSelection>,
    ): EditorSelection {
        return {
            actors: [
                {
                    ...DEFAULT_ACTOR_SELECTION, 
                    actor_index: 0,
                    ...selection, 
                },
            ],
        }
    }

})

function toggle(state: EditorState, selection: EditorSelection): EditorState {
    return toggle_selection_command.exec(state, selection)
}

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
