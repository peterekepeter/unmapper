import { loadMapFromString, storeMapToString } from '..';

// these tests check that after importing and exporting the map, 
// the importer reads back the same map, ensures no properties are lost
// during the export phase

testReImport("a light",`Begin Map
Begin Actor Class=Light Name=Light0
    bDynamicLight=True
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Light
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    Location=(X=-768.000000,Y=-304.000000)
    OldLocation=(X=-768.000000,Y=-304.000000)
    bSelected=True
    Name=Light0
End Actor
End Map
`);

testReImport("plane brush", `Begin Map
Begin Actor Class=Brush Name=Brush1
    CsgOper=CSG_Add
    MainScale=(SheerAxis=SHEER_ZX)
    PostScale=(SheerAxis=SHEER_ZX)
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Brush
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    bSelected=True
    Begin Brush Name=Model2
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
    Brush=Model'MyLevel.Model2'
    Name=Brush1
End Actor
End Map
`);

function testReImport(name : string, input : string){
    test(name, () => {
        const loaded = loadMapFromString(input);
        const reExported = storeMapToString(loaded);
        const reLoaded = loadMapFromString(reExported);
        expect(reLoaded).toEqual(loaded);
    })
}