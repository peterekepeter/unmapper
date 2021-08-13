import { BrushModel } from "../BrushModel"
import { load_map_from_string } from "../loader"
import { Vector } from "../Vector"
import { get_brush_polygon_vertex_uvs, set_brush_polygon_vertex_uvs } from "./vertex_uv"

// specialized test which tests if UVs can be properly transfered from polygon to polygon

let brush: BrushModel = null

beforeAll(() => brush = get_test_triangle())

test('repeatedly getting and setting vertex uvs results in same vertex uv', () => {
    const original_uvs = get_brush_polygon_vertex_uvs(brush, 0)
    let edited_brush = brush
    for (let i = 0; i < 10; i++) {
        const uvs = get_brush_polygon_vertex_uvs(edited_brush, 0)
        edited_brush = set_brush_polygon_vertex_uvs(edited_brush, 0, uvs)
        expect(edited_brush).toEqual(brush)
        expect(uvs).toEqual(original_uvs)
    }
})

test('moving a vertex of the brush then transfering uvs should result in same vertex uv', () => {
    const original_uvs = get_brush_polygon_vertex_uvs(brush, 0)
    let edited_brush = brush.shallow_copy()
    edited_brush.vertexes = [...edited_brush.vertexes]
    const edited_vertex = edited_brush.vertexes[0].shallow_copy()
    edited_brush.vertexes[0] = edited_vertex
    edited_vertex.position = edited_vertex.position.add_numbers(1, 0, 0)
    edited_brush = set_brush_polygon_vertex_uvs(edited_brush, 0, original_uvs)
    const uvs_after_edit = get_brush_polygon_vertex_uvs(edited_brush, 0)
    expectVectorsToBeCloseTo(original_uvs, uvs_after_edit, 10)
})

function expectVectorsToBeCloseTo(a: Vector[], b: Vector[], digits: number) {
    if (a.length != b.length) {
        expect(a).toEqual(b) // throw with pretty message
    }
    const delta = 1 / Math.pow(10, digits)
    for (let i = 0; i < a.length; i++) {
        if (Math.abs(a[i].x - b[i].x) > delta){
            expect(a).toEqual(b) // throw with pretty message
        }
    }
}


function get_test_triangle(): BrushModel {
    return load_map_from_string(`Begin Map
    Begin Actor Class=Brush Name=Brush5
        Location=(Z=224.000000)
        CsgOper=CSG_Add
        Begin Brush Name=Model6
           Begin PolyList
              Begin Polygon Item=Sheet Flags=264 Texture=Icer
                 Origin   +00128.000000,+00128.000000,+00000.000000
                 Normal   +00000.000000,+00000.000000,-00001.000000
                 TextureU -00002.000000,+00000.000000,+00000.000000
                 TextureV +00000.000000,+00002.000000,+00000.000000
                 Vertex   +00000.000000,+00000.000000,+00000.000000
                 Vertex   +00128.000000,+00000.000000,+00000.000000
                 Vertex   +00000.000000,+00128.000000,+00000.000000
              End Polygon
           End PolyList
        End Brush
        Brush=Model'MyLevel.Model6'
    End Actor
    End Map
    `).actors[0].brushModel
}