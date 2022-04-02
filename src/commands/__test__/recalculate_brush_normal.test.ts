import { BrushModel } from "../../model/BrushModel"
import { DEFAULT_ACTOR_SELECTION, DEFAULT_EDITOR_SELECTION } from "../../model/EditorSelection"
import { create_initial_editor_state, EditorState } from "../../model/EditorState"
import { import_map_obj } from "../../model/loader/import_obj/import_map_obj"
import { Vector } from "../../model/Vector"
import { recalculate_brush_normal_command as command } from "../recalculate_brush_normal"


describe('initial state', () => {

    let state: EditorState
    let brush: BrushModel

    beforeAll(() => {
        state = two_touching_planes_with_opposite_normals()
        brush = state.map.actors[0].brushModel
    })

    test('not null', ()=> expect(brush).not.toBeNull())

    test('has 2 polygons with opposite normals', () => {
        const polyA = brush.polygons[0]
        const polyB = brush.polygons[1]
        const result = polyA.normal.add_vector(polyB.normal)
        expect(result).toEqual(Vector.ZERO)
    })

    test('polygons are adjacent', () => {
        const edge = brush.edges.find(e => e.polygons.length === 2)
        expect(edge).toMatchObject({ polygons: [0, 1] })
    })

    test('recalculate makes both normals point into same direction', () => {
        const resultState = command.exec(state)
        const brush = resultState.map.actors[0].brushModel
        expect(brush.polygons[0].normal).toEqual(brush.polygons[1].normal)
    })

    test('second recalculate flips the normals', () => {
        const first = command.exec(state)
        const second = command.exec(first)
        const firstBrush = first.map.actors[0].brushModel
        const secondBrush = second.map.actors[0].brushModel
        for (let i=0; i<firstBrush.polygons.length; i++){
            const sum = firstBrush.polygons[i].normal
                .add_vector(secondBrush.polygons[i].normal)
            expect(sum).toEqual(Vector.ZERO)
        }
    })

    test('first polygon not changed if only second is selected in vertex mode', () => {
        set_vertex_mode_and_select_polygon(1)
        const result = command.exec(command.exec(state)) // call it twice for good measure
        const initialBrush = state.map.actors[0].brushModel
        const changedBrush = result.map.actors[0].brushModel
        expect(initialBrush.polygons[0]).toBe(changedBrush.polygons[0])
        expect(initialBrush.polygons[1]).not.toBe(changedBrush.polygons[1])
    })

    test('second polygon not changed if only first is selected in vertex mode', () => {
        set_vertex_mode_and_select_polygon(0)
        const result = command.exec(command.exec(state)) // call it twice for good measure
        const initialBrush = state.map.actors[0].brushModel
        const changedBrush = result.map.actors[0].brushModel
        expect(initialBrush.polygons[1]).toBe(changedBrush.polygons[1])
        expect(initialBrush.polygons[0]).not.toBe(changedBrush.polygons[0])
    })

    function set_vertex_mode_and_select_polygon(index: number){
        state = {
            ...state,
            options: {
                ...state.options,
                vertex_mode: true,
            },
            selection: { actors: [{ ...state.selection.actors[0], polygons: [index] }] }, 
        }
    }


})


function two_touching_planes_with_opposite_normals(): EditorState {
    const state = create_initial_editor_state()
    /**
     *  two adjacent sheets:
     *           1        2        3
     *            _______ ________      y:+1.0  
     *          /       /       /
     *        /   ^   /   v   /
     *      /_______/_______/           y: 0.0
     *    4        5         6
     * 
     *  x: -1      0       +1 
     *  
     */
    state.map = import_map_obj(`
        o TestMesh
        v -1 +1  0
        v  0 +1  0
        v +1 +1  0
        v -1  0  0
        v  0  0  0
        v +1  0  0
        f 1 2 5 4
        f 2 5 6 3
    `, {
        up_axis: "z",
        uv_scale: 1.0,
        world_scale: 1.0,
    })
    state.selection = {
        ...DEFAULT_EDITOR_SELECTION,
        actors: [
            {
                ...DEFAULT_ACTOR_SELECTION,
                actor_index: 0,
            },
        ],
    }
    return state
}
