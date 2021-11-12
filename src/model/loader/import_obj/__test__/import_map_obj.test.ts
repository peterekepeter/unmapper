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
        vt 0.000000 0.500000
        vt 0.000000 0.000000
        vt 0.500000 0.500000
        vt 0.500000 0.000000
        vn 0.0000 1.0000 0.0000
        usemtl Material
        s off
        f 1/1/1 3/3/1 4/4/1 2/2/1
    `
    
    let map: UnrealMap
    let brush: BrushModel

    beforeAll(() => {
        map = fn(wavefront_obj_data)
        brush = map?.actors[0]?.brushModel
    })

    test("1 actor imported", () => 
        expect(map.actors).toHaveLength(1))

    test("actor is named Plane", () => 
        expect(map.actors[0].name).toBe("Plane"))

    test("has 4 vertexes", () => 
        expect(brush.vertexes).toHaveLength(4))

    test("first vertex is 1, 0, -1", () => 
        expect(brush.vertexes[0].position).toEqual(new Vector(1, 0, -1)))

    test("plane has 1 polygon", () => {
        expect(brush.polygons).toHaveLength(1)
    })

    test("plane polygon has 4 vertexes", () => {
        expect(brush.polygons[0].vertexes).toHaveLength(4)
    })

    test("plane polygon has texture string", () => {
        expect(brush.polygons[0].texture).toBe("Material")
    })

    test("plane polygon has 4 edges", () => {
        expect(brush.polygons[0].edges).toHaveLength(4)
    })

    test("origin", () => {
        expect(brush.polygons[0].origin).toEqual({ x: 1, y: 0, z: 1 })
    })

    test("textureU", () => {
        expect(brush.polygons[0].textureU).toEqual({ x: -0.25, y: 0, z: 0 })
    })
    
    test("textureV", () => {
        expect(brush.polygons[0].textureV).toEqual({ x: 0, y: 0, z: -0.25 })
    })

})

describe("importing cube", () => {
    /* eslint-disable spellcheck/spell-checker */
    const wavefront_obj_data = `# Blender v2.92.0 OBJ File: ''
        # www.blender.org
        mtllib untitled.mtl
        o Cube
        v 1.000000 1.000000 -1.000000
        v 1.000000 -1.000000 -1.000000
        v 1.000000 1.000000 1.000000
        v 1.000000 -1.000000 1.000000
        v -1.000000 1.000000 -1.000000
        v -1.000000 -1.000000 -1.000000
        v -1.000000 1.000000 1.000000
        v -1.000000 -1.000000 1.000000
        vt 0.625000 0.500000
        vt 0.875000 0.500000
        vt 0.875000 0.750000
        vt 0.625000 0.750000
        vt 0.375000 0.750000
        vt 0.625000 1.000000
        vt 0.375000 1.000000
        vt 0.375000 0.000000
        vt 0.625000 0.000000
        vt 0.625000 0.250000
        vt 0.375000 0.250000
        vt 0.125000 0.500000
        vt 0.375000 0.500000
        vt 0.125000 0.750000
        vn 0.0000 1.0000 0.0000
        vn 0.0000 0.0000 1.0000
        vn -1.0000 0.0000 0.0000
        vn 0.0000 -1.0000 0.0000
        vn 1.0000 0.0000 0.0000
        vn 0.0000 0.0000 -1.0000
        usemtl Material
        s off
        f 1/1/1 5/2/1 7/3/1 3/4/1
        f 4/5/2 3/4/2 7/6/2 8/7/2
        f 8/8/3 7/9/3 5/10/3 6/11/3
        f 6/12/4 2/13/4 4/5/4 8/14/4
        f 2/13/5 1/1/5 3/4/5 4/5/5
        f 6/11/6 5/10/6 1/1/6 2/13/6

        `
    let map: UnrealMap
    let brush: BrushModel

    beforeAll(() => {
        map = fn(wavefront_obj_data)
        brush = map?.actors[0]?.brushModel
    })

    test("1 actor imported", () => 
        expect(map.actors).toHaveLength(1))

    test("actor is named Cube", () => 
        expect(map.actors[0].name).toBe("Cube"))

    test("actor has brush model", () => 
        expect(map.actors[0].brushModel).not.toBeNull())

    test("has 8 vertexes", () => 
        expect(brush.vertexes).toHaveLength(8))

    test("has 12 edges", () => 
        expect(brush.edges).toHaveLength(12))

    test("has 6 polygons", () => 
        expect(brush.polygons).toHaveLength(6))

})
