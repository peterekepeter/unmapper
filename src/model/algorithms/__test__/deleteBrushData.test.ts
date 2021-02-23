import { BrushEdge } from "../../BrushEdge"
import { BrushModel } from "../../BrushModel"
import { BrushPolygon } from "../../BrushPolygon"
import { BrushVertex } from "../../BrushVertex"
import { Vector } from "../../Vector"
import { deleteBrushData } from "../deleteBrushData"


test('can delete vertexes', () => {
    const original = new BrushModel();
    original.vertexes = BrushVertex.fromArrayToList([
        /*0*/ 0, 0, 0, /*1*/ 0, 1, 1, /*2*/ 1, 1, 3,
    ])
    const result = deleteBrushData(original, { vertexes: [0, 2] })
    expect(original.vertexes).toHaveLength(3)
    expect(original.vertexes[0].position).toEqual({ x: 0, y: 0, z: 0 })
    expect(result.vertexes).toHaveLength(1)
    expect(result.vertexes[0].position).toEqual({ x: 0, y: 1, z: 1 })
})

test('can delete edge', () => {
    const original = new BrushModel();
    original.vertexes = BrushVertex.fromArrayToList([
        /*0*/ 0, 0, 0, /*1*/ 0, 1, 1, /*2*/ 1, 1, 3,
    ])
    original.edges = BrushEdge.fromArrayToList([
        /*0*/ 0, 1, /*1*/ 1, 2
    ])

    const result = deleteBrushData(original, { edges: [0] })

    expect(original.edges).toHaveLength(2)
    expect(original.edges[0].vertexIndexA).toBe(0)
    expect(result.edges).toHaveLength(1)
    expect(result.edges[0].vertexIndexA).toBe(1)
})

test('can delete poly', () => {
    const original = new BrushModel();
    original.vertexes = BrushVertex.fromArrayToList([
        /*0*/ 0, 0, 0, /*1*/ 0, 0, 1, /*2*/ 1, 0, 1, /*3*/ 1, 0, 0,
    ])
    const polyA = new BrushPolygon()
    polyA.vertexes = [0, 1, 2]
    const polyB = new BrushPolygon()
    polyB.vertexes = [2, 3, 0]
    original.polygons = [polyA, polyB]

    const result = deleteBrushData(original, { polygons: [0] })

    expect(original.polygons).toHaveLength(2)
    expect(original.polygons[0].vertexes[0]).toBe(0)
    expect(result.polygons).toHaveLength(1)
    expect(result.polygons[0].vertexes[0]).toBe(2)
})

test('deleting vertexes deletes edge', () => {
    const original = new BrushModel()
    original.vertexes = BrushVertex.fromArrayToList([
        /*0*/ 0, 0, 0, /*1*/ 0, 1, 1, /*2*/ 1, 1, 3,
    ])
    original.edges = BrushEdge.fromArrayToList([
        /*0*/ 0, 1, /*1*/ 1, 2
    ])

    const result = deleteBrushData(original, { vertexes: [0] })

    expect(result.vertexes).toMatchObject([
        { position: new Vector(0, 1, 1) },
        { position: new Vector(1, 1, 3) }
    ])
    expect(result.edges).toMatchObject([
        { vertexIndexA: 0, vertexIndexB: 1 }
    ] as BrushEdge[])
})