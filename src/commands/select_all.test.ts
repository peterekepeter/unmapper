import { Actor } from '../model/Actor';
import { editor_state_from_actors } from '../model/EditorState';
import * as select_all from './select_all';

describe('select all actors', () =>{

    const actor_a = new Actor();
    const actor_b = new Actor();
    const current_state = editor_state_from_actors([actor_a, actor_b]);
    const next_state = select_all.implementation(current_state);
    
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
