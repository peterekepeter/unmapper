/* eslint-disable spellcheck/spell-checker */
import { editor_state_from_actors, EditorState } from "../../EditorState"
import { UnrealMap } from "../../UnrealMap"
import { import_map_obj } from "../import_obj/import_map_obj"
import { export_map_obj } from "./export_map_obj"

describe("exporting imported plane", () => {
    const wavefront_obj_data = `# unmapper OBJ export v1
o Plane
v 1 0 -1
v 1 0 1
v -1 0 -1
v -1 0 1
vt 0 0.5
vt 0.5 0.5
vt 0.5 0
vt 0 0
vn 0 1 0
f 1/1/1 3/2/1 4/3/1 2/4/1`

    let map: UnrealMap
    let exported: string
    let state: EditorState

    beforeAll(() => {
        // first make sure import works!
        map = import_map_obj(wavefront_obj_data)
        state = editor_state_from_actors(map.actors)
        exported = export_map_obj(state, false)
    })

    test('exporting works', () => {
        expect(exported.length).toBeGreaterThan(100)
    })

    test('exported contains vertexes', () => {
        expect(exported.includes("v")).toBe(true)
    })

    test('export equals imported string', () => 
        expect(exported).toBe(wavefront_obj_data))
    
})
describe("exporting multiple imported objects", () => {
    const wavefront_obj_data = `# unmapper OBJ export v1
o Plane
v 1 0 -1
v 1 0 1
v -1 0 -1
v -1 0 1
vt 0 0.5
vt 0.5 0.5
vt 0.5 0
vt 0 0
vn 0 1 0
f 1/1/1 3/2/1 4/3/1 2/4/1
o Plane2
v 1 0 -1
v 1 0 1
v -1 0 -1
v -1 0 1
vt 0 0.5
vt 0.5 0.5
vt 0.5 0
vt 0 0
vn 0 1 0
f 5/5/2 7/6/2 8/7/2 6/8/2`

    let map: UnrealMap
    let exported: string
    let state: EditorState

    beforeAll(() => {
        // first make sure import works!
        map = import_map_obj(wavefront_obj_data)
        state = editor_state_from_actors(map.actors)
        exported = export_map_obj(state, false)
    })

    test('exporting works', () => {
        expect(exported.length).toBeGreaterThan(100)
    })

    test('exported contains Plane', () => {
        expect(exported.includes("Plane")).toBe(true)
    })
    
    test('exported contains Plane2', () => {
        expect(exported.includes("Plane")).toBe(true)
    })

    test('export equals imported string', () => 
        expect(exported).toBe(wavefront_obj_data))
    
})

describe("exporting imported plane with degenrate UV", () => {
    const wavefront_obj_data = `# unmapper OBJ export v1
o Plane
v 1 0 -1
v 1 0 1
v -1 0 -1
v -1 0 1
vt 0 0
vt 0 0
vt 0 0
vt 0 0
vn 0 1 0
f 1/1/1 3/2/1 4/3/1 2/4/1`

    let map: UnrealMap
    let exported: string
    let state: EditorState

    beforeAll(() => {
        // first make sure import works!
        map = import_map_obj(wavefront_obj_data)
        state = editor_state_from_actors(map.actors)
        exported = export_map_obj(state, false)
    })

    test('import does not throw', () => 
        expect(() => import_map_obj(wavefront_obj_data)).not.toThrow())

    test('export equals imported string', () => 
        expect(exported).toBe(wavefront_obj_data))
    
})
