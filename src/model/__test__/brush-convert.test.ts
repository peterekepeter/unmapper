import { brushToPolygonData, polygonDataToBrush } from "../brush-convert";
import { BrushEdge } from "../BrushEdge";
import { BrushModel } from "../BrushModel";
import { BrushPolygon } from "../BrushPolygon";
import { importPolygon } from "../loader/import/import-polygon";
import { Vector } from "../Vector";

const testDataSheet = [importPolygon(`
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
End Polygon`)];



describe('testDataSheet conversion to BrushModel', () => {
    let brush : BrushModel;
    let poly : BrushPolygon;

    beforeAll(() =>  {
        brush = polygonDataToBrush(testDataSheet);
        poly = brush.polygons[0];
    })

    // test poly builder features
    test('returns brush object', () => expect(brush).toBeDefined());
    test('has 1 polygon', () => expect(brush.polygons.length).toBe(1));
    test('has 4 edges', () => expect(brush.edges.length).toBe(4));
    test('has 4 vertexes', () => expect(brush.vertexes.length).toBe(4));

    test('each edge has 2 vertexes', () => {
        for (const edge of brush.edges){
            expect(edge.vertexIndexA).not.toBe(BrushEdge.MISSING_VERTEX)
            expect(edge.vertexIndexB).not.toBe(BrushEdge.MISSING_VERTEX)
        }
    })

    test('each edge of sheet has 1 polygon', () => {
        for (const edge of brush.edges){
            expect(edge.polygons).toHaveLength(1);
        }
    })
    
    // verify property transfer
    test('polygon has correct properties', () => expect(poly).toMatchObject({
        link : 60,
        item : "Sheet",
        flags : 264,
        panU : 335,
        panV : -117,
        normal : new Vector(0,0,-1),
        origin : new Vector(128,128,0),
        median : new Vector(0,0,0),
        texture : "bTrainH1",
        textureU : new Vector(-1,0,0),
        textureV : new Vector(0,+1,0),
    }))
})