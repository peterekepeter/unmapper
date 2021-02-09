import { Actor } from '../../model/Actor';
import { BrushModel } from '../../model/BrushModel';
import { editor_state_from_actors } from '../../model/EditorState';
import { Vector } from '../../model/Vector';
import { select_all_command as command } from '../select_all';


describe('select all actors', () =>{

    const actor_a = new Actor();
    const actor_b = new Actor();
    const current_state = editor_state_from_actors([actor_a, actor_b]);
    const next_state = command.exec(current_state);
    
    test('next_state actor 0 is selected', () => {
        expect(next_state.map.actors[0].selected).toBe(true);
    });

    test('next_state actor 1 is selected', () => {
        expect(next_state.map.actors[1].selected).toBe(true);
    });

    test('current_state actor 0 is not selected', () => {
        expect(current_state.map.actors[0].selected).toBe(false);
    });

    test('current_state actor 1 is not selected', () => {
        expect(current_state.map.actors[1].selected).toBe(false);
    });
    
})

describe('select all vertexes', () => {

    const actor_a = new Actor();
    actor_a.brushModel = new BrushModel();
    actor_a.brushModel.addVertex(new Vector(0,3,14), false);
    actor_a.selected = true;
    const actor_b = new Actor();
    actor_b.brushModel = new BrushModel();
    actor_b.brushModel.addVertex(new Vector(0,0,0), false);
    actor_b.selected = false;
    const current_state = editor_state_from_actors([actor_a, actor_b]);
    current_state.vertex_mode = true;
    const next_state = command.exec(current_state);

    test('current_state vertexes of selected actor are not selected', () =>
        expect(current_state.map.actors[0].brushModel.vertexes[0].selected).toBe(false)
    )

    test('current_state vertexes of non-selected actor are not selected', () =>
        expect(current_state.map.actors[1].brushModel.vertexes[0].selected).toBe(false)
    )

    test('next_state vertexes of selected actor are selected', () =>
        expect(next_state.map.actors[0].brushModel.vertexes[0].selected).toBe(true)
    )

    test('next_state vertexes of non-selected actor are not selected', () =>
        expect(next_state.map.actors[1].brushModel.vertexes[0].selected).toBe(false)
    )

    test('next_state actor 0 stays true', () => {
        expect(next_state.map.actors[0].selected).toBe(true);
    });

    test('next_state actor 1 stays false', () => {
        expect(next_state.map.actors[1].selected).toBe(false);
    });


});