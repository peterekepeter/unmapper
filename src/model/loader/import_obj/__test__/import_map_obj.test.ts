import { BrushModel } from "../../../BrushModel"
import { UnrealMap } from "../../../UnrealMap"
import { Vector } from "../../../Vector"
import { import_map_obj as fn } from "../import_map_obj"

describe("importing test_data_obj_plane", () => {

    // eslint-disable-next-line spellcheck/spell-checker
    const wavefront_obj_data = `
        # Blender v2.92.0 OBJ File: ''
        # www.blender.org
        mtllib plane.mtl
        o Plane
        v 1.000000 0.000000 -1.000000
        v 1.000000 0.000000 1.000000
        v -1.000000 0.000000 -1.000000
        v -1.000000 0.000000 1.000000
        vt 0.625000 0.500000
        vt 0.875000 0.500000
        vt 0.875000 0.750000
        vt 0.625000 0.750000
        vn 0.0000 1.0000 0.0000
        usemtl Material
        s off
        f 1/1/1 3/2/1 4/3/1 2/4/1
    `
    
    let map: UnrealMap
    let brush: BrushModel

    beforeAll(() => {
        map = fn(wavefront_obj_data)
        brush = map?.actors[0]?.brushModel
    })

    test("1 actor imported", () => 
        expect(map.actors).toHaveLength(1))

    test("has 4 vertexes", () => 
        expect(brush.vertexes).toHaveLength(4))

    test("first vertex is 1, 0, -1", () => 
        expect(brush.vertexes[0].position).toEqual(new Vector(1, 0, -1)))

    test("has 1 polygon", () => {
        expect(brush.polygons).toHaveLength(1)
    })

    test("polygon has 4 vertexes", () => {
        expect(brush.polygons[0].vertexes).toHaveLength(4)
    })
})
