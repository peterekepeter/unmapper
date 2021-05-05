import { Actor } from '../../model/Actor';
import { BrushModel } from '../../model/BrushModel';
import { EditorError } from '../../model/EditorError';
import { editor_state_from_actors } from '../../model/EditorState';
import { Vector } from '../../model/Vector';
import { create_polygon_command as command } from '../create_polygon';


describe('polygon creation', () => {

    const actor = new Actor();
    actor.brushModel = new BrushModel();
    actor.brushModel.addVertex(new Vector(1,1,0), false); // not selected!!
    actor.brushModel.addVertex(new Vector(0,0,0), true);
    actor.brushModel.addVertex(new Vector(1,0,0), true);
    actor.brushModel.addVertex(new Vector(0,1,0), true);
    actor.selected = true;
    const prev_state = editor_state_from_actors([actor]);
    prev_state.options.vertex_mode = true;
    const next_state = command.exec(prev_state);

    test('before execution brushmodel has 0 polygons', () => 
        expect(prev_state.map.actors[0].brushModel.polygons).toHaveLength(0));

    test('after execution brushmodel has 1 polygon', () => 
        expect(next_state.map.actors[0].brushModel.polygons).toHaveLength(1));

    test('new polygon has selected vertexes', () => 
        expect(new Set(next_state.map.actors[0].brushModel.polygons[0].vertexes))
        .toEqual(new Set([1,2,3])));
    
}) 

test('EditorError is thrown if not in vertex mode', async () => {
    const state = editor_state_from_actors([]);
    state.options.vertex_mode = false;
    let error : EditorError;
    try {
        await command.exec(state);
    } catch(obj){
        error = EditorError.cast(obj);
    }
    expect(error).not.toBeNull();
})
