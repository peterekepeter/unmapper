import { importBrushModel } from "../import-brushmodel";
import { Vector } from "../../../Vector";

test("can import with empty body", () => {
    const input = `
    Begin Brush Name=Model554
    End Brush
    `;
    const brush = importBrushModel(input);
    expect(brush.name).toBe("Model554");
    expect(brush.polygons).toHaveLength(0);
})

test("can import with dummy polygons", () => {
    const input = `
    Begin Brush Name=Model554
        Begin PolyList
            Begin Polygon Item=Sheet Flags=264
            End Polygon
            Begin Polygon Item=Sheet Flags=264
            End Polygon
            Begin Polygon Item=Sheet Flags=264
            End Polygon
        End PolyList
    End Brush
    `;
    const brush = importBrushModel(input);
    expect(brush.name).toBe("Model554");
    expect(brush.polygons).toHaveLength(3);
})

test("can import cube model", () => {
    const brush = importBrushModel(cubeData);
    expect(brush.polygons).toHaveLength(6);
    expect(brush.polygons[0].origin).toEqual(new Vector(-128, -128, -128));
})

const cubeData = `
    Begin Brush Name=Model555
       Begin PolyList
          Begin Polygon
             Origin   -00128.000000,-00128.000000,-00128.000000
             Normal   -00001.000000,+00000.000000,+00000.000000
             TextureU +00000.000000,+00001.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   -00128.000000,-00128.000000,-00128.000000
             Vertex   -00128.000000,-00128.000000,+00128.000000
             Vertex   -00128.000000,+00128.000000,+00128.000000
             Vertex   -00128.000000,+00128.000000,-00128.000000
          End Polygon
          Begin Polygon
             Origin   -00128.000000,+00128.000000,-00128.000000
             Normal   +00000.000000,+00001.000000,+00000.000000
             TextureU +00001.000000,-00000.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   -00128.000000,+00128.000000,-00128.000000
             Vertex   -00128.000000,+00128.000000,+00128.000000
             Vertex   +00128.000000,+00128.000000,+00128.000000
             Vertex   +00128.000000,+00128.000000,-00128.000000
          End Polygon
          Begin Polygon
             Origin   +00128.000000,+00128.000000,-00128.000000
             Normal   +00001.000000,+00000.000000,+00000.000000
             TextureU +00000.000000,-00001.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   +00128.000000,+00128.000000,-00128.000000
             Vertex   +00128.000000,+00128.000000,+00128.000000
             Vertex   +00128.000000,-00128.000000,+00128.000000
             Vertex   +00128.000000,-00128.000000,-00128.000000
          End Polygon
          Begin Polygon
             Origin   +00128.000000,-00128.000000,-00128.000000
             Normal   +00000.000000,-00001.000000,+00000.000000
             TextureU -00001.000000,-00000.000000,-00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   +00128.000000,-00128.000000,-00128.000000
             Vertex   +00128.000000,-00128.000000,+00128.000000
             Vertex   -00128.000000,-00128.000000,+00128.000000
             Vertex   -00128.000000,-00128.000000,-00128.000000
          End Polygon
          Begin Polygon
             Origin   -00128.000000,+00128.000000,+00128.000000
             Normal   +00000.000000,+00000.000000,+00001.000000
             TextureU +00001.000000,+00000.000000,+00000.000000
             TextureV +00000.000000,+00001.000000,+00000.000000
             Vertex   -00128.000000,+00128.000000,+00128.000000
             Vertex   -00128.000000,-00128.000000,+00128.000000
             Vertex   +00128.000000,-00128.000000,+00128.000000
             Vertex   +00128.000000,+00128.000000,+00128.000000
          End Polygon
          Begin Polygon
             Origin   -00128.000000,-00128.000000,-00128.000000
             Normal   +00000.000000,+00000.000000,-00001.000000
             TextureU +00001.000000,+00000.000000,+00000.000000
             TextureV +00000.000000,-00001.000000,+00000.000000
             Vertex   -00128.000000,-00128.000000,-00128.000000
             Vertex   -00128.000000,+00128.000000,-00128.000000
             Vertex   +00128.000000,+00128.000000,-00128.000000
             Vertex   +00128.000000,-00128.000000,-00128.000000
          End Polygon
       End PolyList
    End Brush
`;

describe('cube import brushmodel', () => {
   const cube = importBrushModel(cubeData);
   
   test('cube has 6 polygons', () => 
      expect(cube.polygons).toHaveLength(6)
   );

   test('cube has 8 vertexes', () => 
      expect(cube.vertexes).toHaveLength(8)
   );

   test('cube has 12 edges', () => 
      expect(cube.edges).toHaveLength(12)
   );

})