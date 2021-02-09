import { Actor } from "../../model/Actor";
import { BrushModel } from "../../model/BrushModel";
import { editor_state_from_actors } from "../../model/EditorState"
import { Vector } from "../../model/Vector";
import { delete_selected_command as command } from '../delete_selected';


describe('actors are deleted', () => {
    const actor_1 = new Actor();
    actor_1.selected = true;
    actor_1.name = 'Actor1';
    const actor_2 = new Actor();
    actor_2.selected = false;
    actor_2.name = 'Actor2';
    const prev_state = editor_state_from_actors([actor_1, actor_2]);
    const next_state = command.exec(prev_state);

    test('only 1 actor should remain', () => 
        expect(next_state.map.actors).toHaveLength(1))

    test('Actor2 remains which was not selected', () => 
        expect(next_state.map.actors[0].name).toBe(actor_2.name));
})


describe('vertexes are deleted', () => {
    const actor = new Actor();
    actor.selected = true;
    const brush = new BrushModel();
    actor.brushModel = brush;
    brush.addVertex(new Vector(0,0,0), false);
    brush.addVertex(new Vector(1,0,0), true);
    const prev_state = editor_state_from_actors([actor]);
    prev_state.vertex_mode = true;
    const next_state = command.exec(prev_state);

    test('only 1 vertex should remain', () => 
        expect(next_state.map.actors[0].brushModel.vertexes).toHaveLength(1))
})