

import { Actor } from "../../model/Actor";
import { createBrushPolygons } from "../../model/algorithms/createBrushPolygon";
import { BrushModel } from "../../model/BrushModel";
import { EditorState, editor_state_from_actors } from "../../model/EditorState";
import { Vector } from "../../model/Vector";
import { implementation as extrude_polygons } from "../extrude_polygons";


describe('extrude polygon', () => {

    const brush = new BrushModel();
    brush.addVertex(new Vector(0,0,0), true); // 0
    brush.addVertex(new Vector(1,0,0), true); // 1
    brush.addVertex(new Vector(1,1,0), true); // 2
    brush.addVertex(new Vector(0,1,0), true); // 3
    const brushWithPoly = createBrushPolygons(brush, [[0,1,2,3]]);
    const actor = new Actor();
    actor.selected = true;
    actor.brushModel = brushWithPoly;
    
    const old_state = editor_state_from_actors([actor]);
    old_state.vertex_mode = true;

    let new_state : EditorState;
    beforeAll(() => {
        new_state = extrude_polygons(old_state);
    })

    test('new state gets returned', () =>
        expect(new_state).not.toBe(old_state));

    test('new state is not null', () =>
        expect(new_state).not.toBeNull())

    test('old state has 1 polygons', () => 
        expect(old_state.map.actors[0].brushModel.polygons.length).toBe(1));

    test('new state has 5 polygons', () => 
        expect(new_state.map.actors[0].brushModel.polygons.length).toBe(5));

})