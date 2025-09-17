/* eslint-disable spellcheck/spell-checker */
import { load_map_from_string, store_map_to_string } from '..'

// these tests check that after importing and exporting the map, 
// the importer reads back the same map, ensures no properties are lost
// during the export phase

test("a light", () => check_reimport(`Begin Map
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
`))

test("plane brush", () => check_reimport(`Begin Map
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
`))

test("brush with scale rotate and shear", () => check_reimport(`Begin Map
    Begin Actor Class=Brush Name=Brush96
       CsgOper=CSG_Add
       MainScale=(Scale=(X=2.000000),SheerAxis=SHEER_ZX)
       PostScale=(Scale=(Y=2.000000),SheerRate=1.000000,SheerAxis=SHEER_ZY)
       PolyFlags=8
       Level=LevelInfo'MyLevel.LevelInfo1'
       Tag=Brush
       Region=(Zone=LevelInfo'MyLevel.LevelInfo1',iLeaf=-1)
       Location=(X=144.000000,Y=-16.000000,Z=-112.000000)
       Rotation=(Pitch=8192,Yaw=8192,Roll=8192)
       bSelected=True
       Begin Brush Name=Model97
       Begin PolyList
           Begin Polygon Item=Sheet Texture=rPanlbas Flags=264
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
       Brush=Model'MyLevel.Model97'
       Name=Brush96
    End Actor
End Map
`))

test("brush with UV components close to zero", () => check_reimport(`Begin Map
Begin Actor Class=Brush Name=Brush428
    Location=(X=2480.000000,Y=368.000000,Z=992.000000)
    OldLocation=(X=2496.000000,Y=384.000000,Z=992.000000)
    Begin Brush Name=Model430
       Begin PolyList
          Begin Polygon Item=OUTSIDE Texture=rbrick Link=4
             Origin   +00585.099609,-00438.228577,-00992.000000
             Normal   +00000.500000,-00000.866025,+00000.000000
             TextureU -00000.866025,-00000.500000,+00000.000009
             TextureV +00000.000077,+00000.000044,-00001.000000
             Vertex   +00585.042603,-00438.261566,-00384.000000
             Vertex   +00585.048401,-00438.258209,+00384.000000
             Vertex   +00141.643127,-00694.258362,+00384.000000
             Vertex   +00141.643417,-00694.258179,-00384.000000
          End Polygon
       End PolyList
    End Brush
    Brush=Model'MyLevel.Model430'
End Actor
End Map
`))

test("handle surface syntax", () => check_reimport(`
Begin Map
Begin Actor Class=Light Name=Light5
     Level=LevelInfo'MyLevel.LevelInfo0'
     Tag="Light"
     Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=359,ZoneNumber=1)
     Location=(X=1169.045532,Y=-924.225403,Z=1054.900024)
     OldLocation=(X=704.000000,Y=64.000000,Z=871.900024)
     bSelected=True
     LightRadius=128
     Name="Light5"
End Actor
Begin Surface
End Surface
End Map
`))

function check_reimport(input : string){
    const loaded = load_map_from_string(input)
    const reExported = store_map_to_string(loaded)
    const reLoaded = load_map_from_string(reExported)
    expect(reLoaded).toEqual(loaded)
}
