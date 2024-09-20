import { Actor } from "../Actor";
import { DEFAULT_ACTOR_SELECTION, DEFAULT_EDITOR_SELECTION } from "../EditorSelection";
import { EditorState, create_initial_editor_state } from "../EditorState";
import { Vector } from "../Vector";
import { ActorChangeResult, change_selected_actors } from "./change_selected_actors"

describe(change_selected_actors, () => {
    const fn = change_selected_actors;

    test("noop", () => {
        const initial = create_initial_editor_state();
        expect(fn(initial, a => a)).toBe(initial);
    })

    test("one actor is returns", () => {
        const initial = create_initial_editor_state();
        initial.map.actors = [ new Actor() ]
        expect(fn(initial, a => a)).toBe(initial);
    })

    test("no change if no actor is selected", () => {
        const initial = create_initial_editor_state();
        initial.map.actors = [ new Actor() ]
        initial.selection = DEFAULT_EDITOR_SELECTION; // nothing selected
        expect(fn(initial, () => null)).toBe(initial);
    })

    test.each<[ActorChangeResult]>([
        [undefined], 
        [null], 
        [[]]
    ])("actor is dropped when %p is returned", (thing: ActorChangeResult) => {
        const initial = create_initial_editor_state();
        initial.map.actors = [ new Actor() ]
        initial.selection = { actors: [{ ...DEFAULT_ACTOR_SELECTION, actor_index: 0 }] }
        const result = fn(initial, () => thing);
        expect(result.map.actors).toHaveLength(0);
    })

    describe("delete 2nd actor from list of 3", () => {

        let result: EditorState;

        beforeAll(() => {
            const initial = create_initial_editor_state();
            initial.map.actors = [ new Actor(), new Actor(), new Actor() ]
            initial.selection = { actors: [{ ...DEFAULT_ACTOR_SELECTION, actor_index: 1 }] }
            result = fn(initial, () => null);
        })

        test("2 actors left", () => expect(result.map.actors).toHaveLength(2))
        test("0 selected", () => expect(result.selection.actors).toHaveLength(0))

    })

    describe('triplicate 2nd actor from list of 3', () => {

        let result: EditorState;

        beforeAll(() => {
            const initial = create_initial_editor_state();
            initial.map.actors = [ new Actor(), new Actor(), new Actor() ]
            initial.map.actors[0].name = "A";
            initial.map.actors[1].name = "B";
            initial.map.actors[2].name = "C";
            initial.selection = { actors: [{ ...DEFAULT_ACTOR_SELECTION, actor_index: 1 }] }
            result = fn(initial, (a) => [a,a,a]);
        })
        
        test("5 actors left", () => expect(result.map.actors).toHaveLength(5))
        test("3 selected", () => expect(result.selection.actors).toHaveLength(3))
        test("selected indices are [1,2,3]", () => 
            expect(result.selection.actors.map(a=>a.actor_index)).toEqual([1,2,3]));
        test("names are A,B,B,B,C", () => 
            expect(result.map.actors.map(a=>a.name).join('')).toBe('ABBBC'))

    })

    describe("4 actors, 2 selected, delete 1st selected", () => {

        let result: EditorState;

        beforeAll(() => {
            const initial = create_initial_editor_state();
            initial.map.actors = [ new Actor(), new Actor(), new Actor(), new Actor() ]
            initial.selection = { actors: [
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 1 },
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 2 },
            ] }
            result = fn(initial, (a,s) => s.actor_index === 1 ? null : a);
        })

        test("3 actors left", () => expect(result.map.actors).toHaveLength(3))
        test("1 selected", () => expect(result.selection.actors).toHaveLength(1))

    })

    describe("4 actors, 2 selected, delete all selected", () => {

        let result: EditorState;

        beforeAll(() => {
            const initial = create_initial_editor_state();
            initial.map.actors = [ new Actor(), new Actor(), new Actor(), new Actor() ]
            initial.selection = { actors: [
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 1 },
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 2 },
            ] }
            result = fn(initial, a => null);
        })

        test("2 actors left", () => expect(result.map.actors).toHaveLength(2))
        test("0 selected", () => expect(result.selection.actors).toHaveLength(0))

    })

    describe("2 actors, select & duplicate all", () => {

        let result: EditorState;

        beforeAll(() => {
            const initial = create_initial_editor_state();
            initial.map.actors = [ new Actor(), new Actor() ]
            initial.selection = { actors: [
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 0 },
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 1 },
            ] }
            result = fn(initial, (a) => [a,a]);
        })

        test("4 actors left", () => expect(result.map.actors).toHaveLength(4))
        test("4 selected", () => expect(result.selection.actors).toHaveLength(4))
        test("selected indices are [0,1,2,3]", () => 
            expect(result.selection.actors.map(a=>a.actor_index)).toEqual([0,1,2,3]));

    })

    describe("2 actors, select & move all", () => {

        let result: EditorState;

        beforeAll(() => {
            const initial = create_initial_editor_state();
            initial.map.actors = [ new Actor(), new Actor() ]
            initial.selection = { actors: [
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 0 },
                { ...DEFAULT_ACTOR_SELECTION, actor_index: 1 },
            ] }
            result = fn(initial, (a) => ({ ...a, location: new Vector(1,2,3) }) as Actor);
        })

        test("2 actors left", () => expect(result.map.actors).toHaveLength(2))
        test("2 selected", () => expect(result.selection.actors).toHaveLength(2))
        test("selected indices are [0,1]", () => 
            expect(result.selection.actors.map(a=>a.actor_index)).toEqual([0,1]));

    })

})