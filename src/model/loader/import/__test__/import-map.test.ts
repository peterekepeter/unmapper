import { importUnrealMap } from "../import-unreal-map";

const testData = `
Begin Map
Begin Actor Class=Brush Name=Brush1
    CsgOper=CSG_Subtract
    MainScale=(SheerAxis=SHEER_ZX)
    PostScale=(SheerAxis=SHEER_ZX)
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Brush
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    bSelected=True
    Brush=Model'MyLevel.Model2'
    Name=Brush1
End Actor
Begin Actor Class=Light Name=Light0
    bDynamicLight=True
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Light
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    Location=(X=96.000000,Y=-96.000000,Z=16.000000)
    OldLocation=(X=96.000000,Y=-96.000000,Z=16.000000)
    bSelected=True
    Name=Light0
End Actor
End Map
`;

test("can import map with multipe actors", () => {
    const map = importUnrealMap(testData);
    expect(map.actors).toHaveLength(2);
});

test("map actors are properly read", () => {
    const map = importUnrealMap(testData);
    const [firstActor , secondActor] = map.actors;
    expect(firstActor.className).toBe("Brush");
    expect(secondActor.className).toBe("Light");
    // assuming import actor is correct we don't need more asserts
});