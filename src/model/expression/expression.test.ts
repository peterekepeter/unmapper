import { Vector } from "../Vector";
import { expression_from_vector as e, vector_from_expression as v } from "./expression"

test('default returns zero vector', () => {
    expect(v('')).toEqual(Vector.ZERO);
})

test('x component', () => {
    expect(v('3x')).toMatchObject({ x: 3 })
})

test('y component', () => {
    expect(v('3y')).toMatchObject({ y: 3 })
})

test('z component', () => {
    expect(v('3z')).toMatchObject({ z: 3 })
})

test('vector with whitspace', () => {
    expect(v('1x 2y 3z')).toMatchObject({ x: 1, y:2, z:3 })
})

test('packed vector', () => {
    expect(v('1x2y3z')).toMatchObject({ x: 1, y:2, z:3 })
})

test('componets are added up', () => {
    expect(v('16x 16x')).toMatchObject({ x: 32 })
})

test('componets can have negative number', () => {
    expect(v('-16x')).toMatchObject({ x: -16 })
})

test('components may cancel each other out', () => {
    expect(v('16x-16x')).toMatchObject({ x: 0 })
})

test('positive sign accepted', () => {
    expect(v('+24y')).toMatchObject({ y: 24 })
})

describe('expression from vector', () => {

    test('each component to string', () => {
        expect(e(Vector.ONES)).toBe('1x 1y 1z')
    })

    test('negatives components to string', () => {
        expect(e(Vector.NEGATIVE_ONES)).toBe('-1x -1y -1z')
    })

    test('only x component', () => {
        expect(e(Vector.UNIT_X)).toBe('1x')
    })

    test('only y component', () => {
        expect(e(Vector.UNIT_X)).toBe('1x')
    })

    test('only z component', () => {
        expect(e(Vector.UNIT_X)).toBe('1x')
    })
})