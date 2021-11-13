import { UnrealMap } from "../../UnrealMap"
import { import_map_obj } from "../import_obj/import_map_obj"

describe("exporting imported plane", () => {
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

    let state: UnrealMap
    let exported: string

    beforeAll(() => {
        // first make sure import works!
        state = import_map_obj(wavefront_obj_data)
        exported = export_map_obj(state, false)
    })

    test('exporting works', () => {
        expect(exported.length).toBeGreaterThan(100)
    })

    test('expoted contains vertexes', () => {
        expect(exported.includes("v")).toBe(true)
    })
    
})
