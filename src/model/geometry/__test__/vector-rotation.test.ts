import { Vector } from "../../Vector"
import {  vector_to_vector_rotation_matrix } from "../vector-rotation"


const vector_to_vector_cases = [
    {
        from: new Vector(1,0,0), to: new Vector(0,1,0), // 90 deg over Z
        cases: [
            { i: new Vector(0,-1,0), out: new Vector(1,0,0) },
            { i: new Vector(0,0,1), out: new Vector(0,0,1) },
            { i: new Vector(-2,0,1), out: new Vector(0,-2,1) },
        ]
    },
    {
        from: new Vector(1,0,0), to: new Vector(0,-1,0), // 90 deg over Z
        cases: [
            { i: new Vector(1,0,0), out: new Vector(0,-1,0) },
            { i: new Vector(0,0,1), out: new Vector(0,0,1) },
        ]
    },
    {
        from: new Vector(1,0,0), to: new Vector(0,0,1), // 90 deg over Y
        cases: [
            { i: new Vector(1,0,0), out: new Vector(0,0,1) },
            { i: new Vector(0,0,1), out: new Vector(-1,0,0) },
            { i: new Vector(0,1,0), out: new Vector(0,1,0) },
        ]
    },
    {
        from: new Vector(0,1,0), to: new Vector(0,0,1), // 90 deg over X
        cases: [
            { i: new Vector(1,0,0), out: new Vector(1,0,0) },
            { i: new Vector(3,1,0), out: new Vector(3,0,1) },
            { i: new Vector(0,0,1), out: new Vector(0,-1,0) },
        ]
    },
    {
        from: new Vector(0,14,0), to: new Vector(0,0,2), // 90 deg over X
        cases: [
            { i: new Vector(1,0,0), out: new Vector(1,0,0) },
        ]
    }
]

vector_to_vector_cases.forEach(({ from, to, cases }) => {
    describe(`rotate from ${from} to ${to}`, () => {
        const matrix = vector_to_vector_rotation_matrix(from, to)
        cases.forEach(({i, out}) => test(`takes ${i} to ${out}`, () => {
            expect(matrix.apply(i)).toEqual(out)
        }))
    })
})
