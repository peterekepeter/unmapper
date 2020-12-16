import { importBrushModel } from "../../loader/import/import-brushmodel";
import { importPolygon } from "../../loader/import/import-polygon"
import { calculate_polygon_normal } from "../calculate_polygon_normal";

const test_data = [
    importBrushModel(`
        Begin Brush Name=XSheetModel243
        Begin PolyList
        Begin Polygon Item=Sheet Texture=SHrock8 Flags=264
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
    `),
    importBrushModel(`
        Begin Brush Name=YSheetModel245
        Begin PolyList
        Begin Polygon Item=Sheet Texture=SHrock8 Flags=264
            Origin   +00128.000000,+00000.000000,+00128.000000
            Normal   +00000.000000,-00001.000000,+00000.000000
            TextureU +00000.000000,+00000.000000,-00001.000000
            TextureV +00001.000000,+00000.000000,+00000.000000
            Vertex   +00128.000000,+00000.000000,+00128.000000
            Vertex   -00128.000000,+00000.000000,+00128.000000
            Vertex   -00128.000000,+00000.000000,-00128.000000
            Vertex   +00128.000000,+00000.000000,-00128.000000
        End Polygon
        End PolyList
        End Brush
    `),
    importBrushModel(`
        Begin Brush Name=ZSheetModel248
        Begin PolyList
            Begin Polygon Item=Sheet Texture=SHrock8 Flags=264
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
    `),
    importBrushModel(`
        Begin Brush Name=CubeModel244
        Begin PolyList
        Begin Polygon Texture=SHrock8
            Origin   -00256.000000,-00256.000000,-00256.000000
            Normal   -00001.000000,+00000.000000,+00000.000000
            TextureU +00000.000000,+00001.000000,+00000.000000
            TextureV +00000.000000,+00000.000000,-00001.000000
            Vertex   -00256.000000,-00256.000000,-00256.000000
            Vertex   -00256.000000,-00256.000000,+00256.000000
            Vertex   -00256.000000,+00256.000000,+00256.000000
            Vertex   -00256.000000,+00256.000000,-00256.000000
        End Polygon
        Begin Polygon Texture=SHrock8
            Origin   -00256.000000,+00256.000000,-00256.000000
            Normal   +00000.000000,+00001.000000,+00000.000000
            TextureU +00001.000000,-00000.000000,+00000.000000
            TextureV +00000.000000,+00000.000000,-00001.000000
            Vertex   -00256.000000,+00256.000000,-00256.000000
            Vertex   -00256.000000,+00256.000000,+00256.000000
            Vertex   +00256.000000,+00256.000000,+00256.000000
            Vertex   +00256.000000,+00256.000000,-00256.000000
        End Polygon
        Begin Polygon Texture=SHrock8
            Origin   +00256.000000,+00256.000000,-00256.000000
            Normal   +00001.000000,+00000.000000,+00000.000000
            TextureU +00000.000000,-00001.000000,+00000.000000
            TextureV +00000.000000,+00000.000000,-00001.000000
            Vertex   +00256.000000,+00256.000000,-00256.000000
            Vertex   +00256.000000,+00256.000000,+00256.000000
            Vertex   +00256.000000,-00256.000000,+00256.000000
            Vertex   +00256.000000,-00256.000000,-00256.000000
        End Polygon
        Begin Polygon Texture=SHrock8
            Origin   +00256.000000,-00256.000000,-00256.000000
            Normal   +00000.000000,-00001.000000,+00000.000000
            TextureU -00001.000000,-00000.000000,-00000.000000
            TextureV +00000.000000,+00000.000000,-00001.000000
            Vertex   +00256.000000,-00256.000000,-00256.000000
            Vertex   +00256.000000,-00256.000000,+00256.000000
            Vertex   -00256.000000,-00256.000000,+00256.000000
            Vertex   -00256.000000,-00256.000000,-00256.000000
        End Polygon
        Begin Polygon Texture=SHrock8
            Origin   -00256.000000,+00256.000000,+00256.000000
            Normal   +00000.000000,+00000.000000,+00001.000000
            TextureU +00001.000000,+00000.000000,+00000.000000
            TextureV +00000.000000,+00001.000000,+00000.000000
            Vertex   -00256.000000,+00256.000000,+00256.000000
            Vertex   -00256.000000,-00256.000000,+00256.000000
            Vertex   +00256.000000,-00256.000000,+00256.000000
            Vertex   +00256.000000,+00256.000000,+00256.000000
        End Polygon
        Begin Polygon Texture=SHrock8
            Origin   -00256.000000,-00256.000000,-00256.000000
            Normal   +00000.000000,+00000.000000,-00001.000000
            TextureU +00001.000000,+00000.000000,+00000.000000
            TextureV +00000.000000,-00001.000000,+00000.000000
            Vertex   -00256.000000,-00256.000000,-00256.000000
            Vertex   -00256.000000,+00256.000000,-00256.000000
            Vertex   +00256.000000,+00256.000000,-00256.000000
            Vertex   +00256.000000,-00256.000000,-00256.000000
        End Polygon
        End PolyList
        End Brush
    `)
];

test_data.forEach(model => {
    describe('calculate normal for '+ model.name, () => {
        model.polygons.forEach((poly, index) => {
            test(index + ': normal of ' + poly.item + ' is ' + JSON.stringify(poly.normal), () =>{
                expect(calculate_polygon_normal(model.vertexes, poly)).toEqual(poly.normal);
            });
        })
    })
})