import { Vector } from "../../Vector"
import { angle_between_unit_vectors, vector_to_vector_rotation_matrix } from "../vector-rotation"


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


describe('angle_between_unit_vectors', () => {

    const angle_fn = angle_between_unit_vectors

    test('between forward, up is 90', () => 
        expect(angle_fn(Vector.FORWARD, Vector.UP)).toBe(90))
    
    test('between forward, backward  is 180', () => 
        expect(angle_fn(Vector.FORWARD, Vector.BACKWARD)).toBe(180))
    
    test('between 45', () => 
        expect(angle_fn(new Vector(1,0,0), new Vector(1,1,0).normalize())).toBeCloseTo(45, 10))

})