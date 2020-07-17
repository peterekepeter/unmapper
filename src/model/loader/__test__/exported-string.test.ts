import { loadMapFromString, storeMapToString } from '..';

// these tests check that after importing a map, the exporter is capable of
// reproducing the imported string

testExporter('empty map', 
`Begin Map
End Map
`);

testExporter('minimal actor', 
`Begin Map
Begin Actor Class=ZoneInfo Name=ZoneInfo123
End Actor
End Map
`);

testExporter('minimal actor, with space in name', 
`Begin Map
Begin Actor Class=ZoneInfo Name="Zone Info123"
End Actor
End Map
`);

testExporter('minimal actor, class only', 
`Begin Map
Begin Actor Class=ZoneInfo
End Actor
End Map
`);

testExporter('map just a light', 
`Begin Map
Begin Actor Class=Light Name=Light0
    bDynamicLight=True
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Light
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    Location=(X=96.000000,Y=-96.000000,Z=16.000000)
    OldLocation=(X=96.000000,Y=-96.000000,Z=16.000000)
End Actor
End Map
`);

testExporter('brush scaling', 
`Begin Map
Begin Actor Class=Brush Name=Brush73
    MainScale=(Scale=(X=8.000000,Y=8.000000,Z=4.000000),SheerAxis=SHEER_ZX)
    PostScale=(SheerAxis=SHEER_ZX)
End Actor
End Map
`)

function testExporter(name : string, input : string){
    test(name, () => {
        const loaded = loadMapFromString(input);
        const reExported = storeMapToString(loaded);
        expect(reExported).toEqual(input);
    });
}