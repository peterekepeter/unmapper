import { create_initial_editor_state } from "../../model/EditorState";
import { Vector } from "../../model/Vector";
import { import_from_string_command } from "../import_from_string";


test('can import from string', () => {
    const state_0 = create_initial_editor_state();
    expect(state_0.map.actors).toHaveLength(0);
    const state_1 = import_from_string_command.exec(state_0, test_string_light);
    expect(state_1.map.actors).toHaveLength(1);
    expect(state_1.map.actors[0]).toMatchObject({ location: new Vector(338.132599,-856.147949,89.705017) })
});

test('importing mutliple times duplicates the imported data', () => {
    let state = create_initial_editor_state();
    expect(state.map.actors).toHaveLength(0);
    for (let n=1; n<=4; n++){
        state = import_from_string_command.exec(state, test_string_light);
        expect(state.map.actors).toHaveLength(n);
    }
})

const test_string_light = `Begin Map
Begin Actor Class=Light Name=Light462
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Light
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=279,ZoneNumber=1)
    Location=(X=338.132599,Y=-856.147949,Z=89.705017)
    OldLocation=(X=354.132599,Y=-840.147949,Z=89.705017)
    bSelected=True
    LightEffect=LE_Cylinder
    LightBrightness=160
    LightRadius=10
    Name=Light462
End Actor
End Map`