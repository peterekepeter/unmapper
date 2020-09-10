import { importPolygon } from "../import-polygon";
import { Vector } from "../../../Vector";

const testData = `
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
End Polygon`;

test("can read polyon item", () =>{
    expect(importPolygon(testData).item).toBe("Sheet");
})

test("can read polyon flags", () =>{
    expect(importPolygon(testData).flags).toBe(264);
})

test("can read polygon origin, normal, uv", () =>{
    const polygon = importPolygon(testData);
    expect(polygon.origin).toEqual(new Vector(128,128,0));
    expect(polygon.normal).toEqual(new Vector(0,0,-1));
    expect(polygon.textureU).toEqual(new Vector(-1,0,0));
    expect(polygon.textureV).toEqual(new Vector(0,+1,0));
})

test("can read polygon vertexes", () =>{
    const polygon = importPolygon(testData);
    expect(polygon.vertexes).toEqual([
        new Vector(+128, +128, 0),
        new Vector(+128, -128, 0),
        new Vector(-128, -128, 0),
        new Vector(-128, +128, 0)
    ]);
})

test("can read texture", () =>{
    expect(importPolygon(testData).texture).toBe("bTrainH1");
})

test("can read link", () =>{
    expect(importPolygon(testData).link).toBe(60);
})

describe('polygon with V pan but no U pan', () =>{
    const testDataVPanOnly = `
        Begin Polygon Item=Sheet Flags=264 Texture=bTrainH1 Link=60
            Origin   +00128.000000,+00128.000000,+00000.000000
            Normal   +00000.000000,+00000.000000,-00001.000000
            Pan      V=-117
            TextureU -00001.000000,+00000.000000,+00000.000000
            TextureV +00000.000000,+00001.000000,+00000.000000
            Vertex   +00128.000000,+00128.000000,+00000.000000
            Vertex   +00128.000000,-00128.000000,+00000.000000
            Vertex   -00128.000000,-00128.000000,+00000.000000
            Vertex   -00128.000000,+00128.000000,+00000.000000
        End Polygon`;
    
    test("can read panV", () =>{
        expect(importPolygon(testDataVPanOnly).panV).toBe(-117);
    })

    test("panU defaults to 0", () =>{
        expect(importPolygon(testDataVPanOnly).panU).toBe(0);
    })
})
