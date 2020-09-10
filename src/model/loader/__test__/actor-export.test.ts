import { loadMapFromString, storeMapToString } from ".."


test('brushmodel ref is after brush defintion', () => {
    // otherwise UED crashes
    const initial = `Begin Map
Begin Actor Class=Brush Name=Brush2
    CsgOper=CSG_Add
    MainScale=(SheerAxis=SHEER_ZX)
    PostScale=(SheerAxis=SHEER_ZX)
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Brush
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    Location=(X=16.000000,Y=16.000000)
    OldLocation=(X=32.000000,Y=32.000000)
    bSelected=True
    Begin Brush Name=Model3
       Begin PolyList
          Begin Polygon Item=Sheet Flags=264
             Origin   +00128.000000,+00128.000000,+00000.000000
             Normal   +00000.000000,+00000.000000,-00001.000000
             TextureU -00001.000000,+00000.000000,+00000.000000
             TextureV +00000.000000,+00001.000000,+00000.000000
             Vertex   +00128.000000,+00128.000000,+00000.000000
             Vertex   +00128.000000,-00128.000000,+00000.000000
             Vertex   -00128.000000,-00128.000000,+00000.000000
             Vertex   -00128.000000,+00128.000000,+00000.000000
          End Polygon
       End PolyList
    End Brush
    Brush=Model'MyLevel.Model3'
    Name=Brush2
End Actor
End Map
`
    const map = loadMapFromString(initial);
    const exported = storeMapToString(map);
    expect(exported.indexOf("Brush=Model'MyLevel.Model3'"))
        .toBeGreaterThan(exported.indexOf("Begin PolyList"));

})