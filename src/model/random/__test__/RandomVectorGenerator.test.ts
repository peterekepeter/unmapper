import { BoundingBox } from '../../BoundingBox'
import { Vector } from '../../Vector'
import { RandomVectorGenerator } from '../RandomVectorGenerator'

describe('next_vector_from_unit_disk', () => {

    let list: Vector[]

    beforeAll(() => {
        const random = new RandomVectorGenerator()
        list = generate_list(() => random.next_vector_from_unit_disk(), 100)
    })

    test('returns vectors with length less than 1',
        () => list.forEach(v => expect(v.length()).toBeLessThanOrEqual(1)))

    test('z component is always 0',
        () => list.forEach(v => expect(v.z).toBe(0)))

    test('mean is close to 0',
        () => expect_vector_close_to(mean_of(list), Vector.ZERO, 1))

})

describe('next_vector_from_unit_circle', () => {

    let list: Vector[]

    beforeAll(() => {
        const random = new RandomVectorGenerator()
        list = generate_list(() => random.next_vector_from_unit_circle(), 100)
    })

    test('returns vectors with length close to 1',
        () => list.forEach(v => expect(v.length()).toBeCloseTo(1, 10)))

    test('z component is always 0',
        () => list.forEach(v => expect(v.z).toBe(0)))

    test('mean is close to 0',
        () => expect_vector_close_to(mean_of(list), Vector.ZERO, 1))

})

describe('next_vector_from_unit_sphere_volume', () => {

    let list: Vector[]

    beforeAll(() => {
        const random = new RandomVectorGenerator()
        list = generate_list(() => random.next_vector_from_unit_sphere_volume(), 100)
    })

    test('returns vectors with length less than 1',
        () => list.forEach(v => expect(v.length()).toBeLessThanOrEqual(1)))

    test('mean is close to 0',
        () => expect_vector_close_to(mean_of(list), Vector.ZERO, 0))

})

describe('next_vector_from_unit_sphere_surface', () => {

    let list: Vector[]

    beforeAll(() => {
        const random = new RandomVectorGenerator()
        list = generate_list(() => random.next_vector_from_unit_sphere_surface(), 100)
    })

    test('returns vectors with length close to 1',
        () => list.forEach(v => expect(v.length()).toBeCloseTo(1, 10)))

    test('mean is close to 0',
        () => expect_vector_close_to(mean_of(list), Vector.ZERO, 0))

})


describe('next_vector_from_bounding_box', () => {

    let list: Vector[]
    let box: BoundingBox

    beforeAll(() => {
        const random = new RandomVectorGenerator()
        box = new BoundingBox({ min_x: 4, max_x: 8, min_y: -3, max_y: -1, min_z: 0, max_z: 16 })
        list = generate_list(() => random.next_vector_from_bounding_box(box), 100)
    })

    test('returns vectors inside the box',
        () => list.forEach(v => expect(box.encloses(v.x, v.y, v.z))))

    test('mean is close to box center',
        () => expect_vector_close_to(mean_of(list), new Vector(6, -2, 8), 0))

})


function generate_list(fn: () => Vector, n: number): Vector[] {
    const list = []
    for (let i = 0; i < n; i++) {
        list.push(fn())
    }
    return list
}

function expect_vector_close_to(received: Vector, expected: Vector, digits = 2) {
    expect(received.x).toBeCloseTo(expected.x, digits)
    expect(received.y).toBeCloseTo(expected.y, digits)
    expect(received.z).toBeCloseTo(expected.z, digits)
}

function mean_of(vectors: Vector[]): Vector {

    let sum_x = 0, sum_y = 0, sum_z = 0
    for (const vector of vectors) {
        sum_x += vector.x
        sum_y += vector.y
        sum_z += vector.z
    }
    sum_x /= vectors.length
    sum_y /= vectors.length
    sum_z /= vectors.length

    return new Vector(sum_x, sum_y, sum_z)
}