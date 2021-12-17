import { range } from "../../util/range"
import { RandomVectorGenerator } from "../random/RandomVectorGenerator"
import { Vector } from "../Vector"
import { polygon_uv_from_vertex_uvs as fn } from "./polygon_uv_from_vertex_uvs"
import { get_vertex_uv } from "./vertex_uv"

let random: RandomVectorGenerator

beforeEach(() => {
    random = new RandomVectorGenerator()
    random.seed = 0
})

describe('UV origin for random triangle, origin at point A', () => {

    test('seed 0', () => impl(0))

    test('sweep', () => range(100).each(impl))
    
    function impl(seed: number){
        random.seed = seed
        const verts = random_triangle()
        const uvs = [Vector.ZERO, Vector.UNIT_X, Vector.UNIT_Y]
        const result = fn(verts, uvs).origin
        expect_vector_close_to(result, verts[0])
    }
})

describe('UV origin for random triangle, origin at point B', () => {

    test('seed 0', () => impl(0))
    test('seed 1', () => impl(1))

    test('sweep', () => range(100).each(impl))
    
    function impl(seed: number){
        random.seed = seed
        const vertexes = random_triangle()
        const uvs = [Vector.UNIT_X, Vector.ZERO, Vector.UNIT_Y]
        const result = fn(vertexes, uvs).origin
        expect_vector_close_to(result, vertexes[1])
    }
})

describe('UV origin for random triangle, origin at point C', () => {

    test('seed 0', () => impl(0))

    test('sweep', () => range(100).each(impl))
    
    function impl(seed: number){
        random.seed = seed
        const vertexes = random_triangle()
        const uvs = [Vector.UNIT_X, Vector.UNIT_Y, Vector.ZERO]
        const result = fn(vertexes, uvs).origin
        expect_vector_close_to(result, vertexes[2])
    }
})

describe('UV origin for random triangle, origin at median', () => {

    test('seed 0', () => impl(0))

    test('sweep', () => range(100).each(impl))
    
    function impl(seed: number){
        random.seed = seed
        const vertexes = random_triangle()
        const origin = vertexes[0].add_vector(vertexes[1]).add_vector(vertexes[2]).scale(1/3)
        const uvs = vertexes.map(r => get_vertex_uv({ origin, textureU: Vector.UNIT_X, textureV: Vector.UNIT_Y, panU: 0, panV: 0 }, r))
        const result = fn(vertexes, uvs).origin
        expect_vector_close_to(result, origin)
    }
})

describe('UV vectors for random triangle', () => {

    test('seed 0', () => impl(0))

    test('sweep', () => range(100).each(impl))

    function impl(seed: number){
        random.seed = seed
        const vertexes = random_triangle()
        const uvs = [Vector.ZERO, Vector.UNIT_X, Vector.UNIT_Y]
        const polygon_uv = fn(vertexes, uvs)
        const result_uvs = vertexes.map(r => get_vertex_uv(polygon_uv, r))

        try {
            vertexes.forEach((_, i) => expect_vector_close_to(result_uvs[i], uvs[i]))
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('failed case:', { seed, vertexes, uvs, result_uvs, polygon_uv })
            throw error
        }
    }
})

describe('UV edge cases', () => {

    describe('all vertexes have same UV coord', () => {

        const same_uv_coords = (uv_coord: Vector) => fn(
            [v(0, 0), v(1, 0), v(0, 1)], 
            [uv_coord, uv_coord, uv_coord],
        )

        test('zero uv coord has correct result', () => {
            const result = same_uv_coords(v(0, 0))
            expect(result.origin).toEqual(v(0, 0))
            expect(result.textureU).toEqual(v(0, 0))
            expect(result.textureV).toEqual(v(0, 0))
        })

        test('non-zero uv coord has correct result', () => {
            const result = same_uv_coords(v(1, 1))
            expect(result.origin).toEqual(v(1, 1))
            expect(result.textureU).toEqual(v(0, 0))
            expect(result.textureV).toEqual(v(0, 0))
        })
    
    })

})

function v(x=0, y=0, z=0){
    return new Vector(x, y, z)
}

function expect_vector_close_to(received: Vector, expected: Vector, digits = 5) {
    expect(received.x).toBeCloseTo(expected.x, digits)
    expect(received.y).toBeCloseTo(expected.y, digits)
    expect(received.z).toBeCloseTo(expected.z, digits)
}

function random_triangle(): Vector[] {
    return [
        random.next_vector_from_unit_sphere_volume(), 
        random.next_vector_from_unit_sphere_volume(), 
        random.next_vector_from_unit_sphere_volume(),
    ]
}
