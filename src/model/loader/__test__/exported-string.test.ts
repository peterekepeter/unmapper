import { load_map_from_string, store_map_to_string } from '..'

// these tests check that after importing a map, the exporter is capable of
// reproducing the imported string

testExporter('empty map', 
`Begin Map
End Map
`)

testExporter('minimal actor', 
`Begin Map
Begin Actor Class=ZoneInfo Name=ZoneInfo123
End Actor
End Map
`)

testExporter('minimal actor, with space in name', 
`Begin Map
Begin Actor Class=ZoneInfo Name="Zone Info123"
End Actor
End Map
`)

testExporter('minimal actor, class only', 
`Begin Map
Begin Actor Class=ZoneInfo
End Actor
End Map
`)

testExporter('map just a light (unsupported props)', 
`Begin Map
Begin Actor Class=Light Name=Light0
    bDynamicLight=True
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Light
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
End Actor
End Map
`)

testExporter('map just a light (supported props)', 
`Begin Map
Begin Actor Class=Light Name=Light0
    Location=(X=96.000000,Y=-96.000000,Z=16.000000)
    OldLocation=(X=96.000000,Y=-96.000000,Z=16.000000)
End Actor
End Map
`)

testExporter('brush scaling', 
`Begin Map
Begin Actor Class=Brush Name=Brush73
    MainScale=(Scale=(X=8.000000,Y=8.000000,Z=4.000000),SheerAxis=SHEER_ZX)
    PostScale=(SheerAxis=SHEER_ZX)
End Actor
End Map
`)

testExporter("brush polygon minimal props", `Begin Map
Begin Actor Class=Brush Name=Brush1
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
End Actor
End Map
`)

testExporter("brush polygon all props", `Begin Map
Begin Actor Class=Brush Name=Brush1
    Begin Brush Name=Model2
       Begin PolyList
          Begin Polygon Item=Sheet Flags=264 Texture=bTrainH1 Link=60
             Origin   +00128.000000,+00128.000000,+00000.000000
             Normal   +00000.000000,+00000.000000,-00001.000000
             Pan      U=335 V=-117
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
End Actor
End Map
`)

testExporter("actor groups", `Begin Map
Begin Actor Class=Light Name=Light0
    Group=None,Group1,Group2
End Actor
End Map
`)

function testExporter(name : string, input : string){
    test(name, () => {
        const loaded = load_map_from_string(input)
        const reExported = store_map_to_string(loaded)
        expect(reExported).toEqual(input)
    })
}