import { BrushModel } from "../BrushModel"
import { load_map_from_string } from "../loader"
import { UnrealMap } from "../UnrealMap"
import { Vector } from "../Vector"
import { get_brush_polygon_vertex_uvs } from "./vertex_uv"

let map: UnrealMap

beforeAll(() => {
    map = load_test_map()
})

test('UVs are generated as expected', () => {
    const brush = get_brush('Brush3')
    const uvs = get_brush_polygon_vertex_uvs(brush, 0)
    expect(uvs).toEqual(expected_uvs)
})

test('UVs as expected for texture scaled polygon', () => {
   const brush = get_brush('SheetScaled2x')
   // since sheet was scaled 2x, then texture gets upscaled
   // and UVs go from 0 to only 128 instead of 256
   const expected = expected_uvs.map(v => v.scale(0.5))
   const uvs = get_brush_polygon_vertex_uvs(brush, 0)
   expect(uvs).toEqual(expected)
})

const rotated_brush_names = [
   'Brush3Rotated1',
   'Brush3Rotated2',
   'Brush3Rotated90'
]

rotated_brush_names.forEach(n => test(
   `UVs as expected for ${n}`, () => {
      const brush = get_brush(n)
      const uvs = get_brush_polygon_vertex_uvs(brush, 0)
      expect(uvs).toHaveLength(expected_uvs.length)
      // rotated versions may have rounding errors
      for (let i=0; i<uvs.length; i++){
         expect(uvs[i].x).toBeCloseTo(expected_uvs[i].x, 1e-3)
         expect(uvs[i].y).toBeCloseTo(expected_uvs[i].y, 1e-3)
      }
   }
))

function get_brush(name: string): BrushModel {
    return map.actors.find(a => a.name === name).brushModel
}

function load_test_map(): UnrealMap {
    return load_map_from_string(_test_level_data)
}

const expected_uvs = [
    new Vector(0, 0, 0),
    new Vector(0., -256.0, 0),
    new Vector(256.0, -256.0, 0),
    new Vector(256.0, 0, 0),
]



/** 
 * contains 4 sheets which are identicaly, except that they are rotated
 * each is expected to have the same vertex UVs
 */
const _test_level_data = `Begin Map
Begin Actor Class=Brush Name=Brush3
    Begin Brush Name=Model4
       Begin PolyList
          Begin Polygon Item=Sheet Texture=bmBox2b Flags=264
             Origin   +00000.000000,+00128.000000,+00128.000000
             Normal   -00001.000000,+00000.000000,+00000.000000
             TextureU +00000.000000,-00001.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,+00001.000000
             Vertex   +00000.000000,+00128.000000,+00128.000000
             Vertex   +00000.000000,+00128.000000,-00128.000000
             Vertex   +00000.000000,-00128.000000,-00128.000000
             Vertex   +00000.000000,-00128.000000,+00128.000000
          End Polygon
       End PolyList
    End Brush
     Brush=Model'MyLevel.Model4'
     Name="Brush3"
End Actor
Begin Actor Class=Brush Name=Brush3Rotated1
    Begin Brush Name=Model5
       Begin PolyList
          Begin Polygon Item=Sheet Texture=bmBox2b Flags=264
             Origin   +00090.509636,+00128.000000,+00090.509666
             Normal   -00000.707107,+00000.000000,+00000.707107
             TextureU +00000.000000,-00001.000000,+00000.000000
             TextureV +00000.707107,+00000.000000,+00000.707107
             Vertex   +00090.509636,+00128.000000,+00090.509666
             Vertex   -00090.509636,+00128.000000,-00090.509666
             Vertex   -00090.509636,-00128.000000,-00090.509666
             Vertex   +00090.509636,-00128.000000,+00090.509666
          End Polygon
       End PolyList
    End Brush
     Brush=Model'MyLevel.Model5'
End Actor
Begin Actor Class=Brush Name=Brush3Rotated2
    Begin Brush Name=Model6
       Begin PolyList
          Begin Polygon Item=Sheet Texture=bmBox2b Flags=264
             Origin   +00118.256569,+00128.000000,+00048.983482
             Normal   -00000.382684,+00000.000000,+00000.923880
             TextureU +00000.000000,-00001.000000,+00000.000000
             TextureV +00000.923880,+00000.000000,+00000.382684
             Vertex   +00118.256569,+00128.000000,+00048.983482
             Vertex   -00118.256569,+00128.000000,-00048.983482
             Vertex   -00118.256569,-00128.000000,-00048.983482
             Vertex   +00118.256569,-00128.000000,+00048.983482
          End Polygon
       End PolyList
    End Brush
     Brush=Model'MyLevel.Model6'
End Actor
Begin Actor Class=Brush Name=Brush3Rotated90
    Begin Brush Name=Model8
       Begin PolyList
          Begin Polygon Item=Sheet Texture=bmBox2b Flags=264
             Origin   +00128.000000,+00128.000000,+00000.000000
             Normal   +00000.000000,+00000.000000,+00001.000000
             TextureU +00000.000000,-00001.000000,+00000.000000
             TextureV +00001.000000,+00000.000000,-00000.000000
             Vertex   +00128.000000,+00128.000000,+00000.000000
             Vertex   -00128.000000,+00128.000000,+00000.000000
             Vertex   -00128.000000,-00128.000000,+00000.000000
             Vertex   +00128.000000,-00128.000000,+00000.000000
          End Polygon
       End PolyList
    End Brush
     Brush=Model'MyLevel.Model8'
End Actor
Begin Actor Class=Brush Name=SheetScaled2x
    Begin Brush Name=Model17
       Begin PolyList
          Begin Polygon Item=Sheet Texture=bmBox2b Flags=264
             Origin   +00000.000000,+00128.000000,+00128.000000
             Normal   -00001.000000,+00000.000000,+00000.000000
             TextureU +00000.000000,-00000.500000,+00000.000000
             TextureV +00000.000000,+00000.000000,+00000.500000
             Vertex   +00000.000000,+00128.000000,+00128.000000
             Vertex   +00000.000000,+00128.000000,-00128.000000
             Vertex   +00000.000000,-00128.000000,-00128.000000
             Vertex   +00000.000000,-00128.000000,+00128.000000
          End Polygon
       End PolyList
    End Brush
     Brush=Model'MyLevel.Model17'
End Actor
End Map
`
