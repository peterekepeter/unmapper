import { range } from "../../util/range"
import { RandomVectorGenerator } from "../random/RandomVectorGenerator"
import { Vector } from "../Vector"
import { polygon_uv_from_vertex_uvs } from "./polygon_uv_from_vertex_uvs"
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
        const result = polygon_uv_from_vertex_uvs(verts, uvs).origin
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
        const result = polygon_uv_from_vertex_uvs(vertexes, uvs).origin
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
        const result = polygon_uv_from_vertex_uvs(vertexes, uvs).origin
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
        const uvs = vertexes.map(v => get_vertex_uv({ origin, textureU: Vector.UNIT_X, textureV: Vector.UNIT_Y, panU: 0, panV: 0}, v))
        const result = polygon_uv_from_vertex_uvs(vertexes, uvs).origin
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
        const polygon_uv = polygon_uv_from_vertex_uvs(vertexes, uvs)
        const result_uvs = vertexes.map(v => get_vertex_uv(polygon_uv, v))

        try {
            vertexes.forEach((_, i) => expect_vector_close_to(result_uvs[i], uvs[i]))
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('failed case:', { seed, vertexes, uvs, result_uvs, polygon_uv })
            throw error
        }
    }
})

function expect_vector_close_to(received: Vector, expected: Vector, digits = 5) {
    expect(received.x).toBeCloseTo(expected.x, digits)
    expect(received.y).toBeCloseTo(expected.y, digits)
    expect(received.z).toBeCloseTo(expected.z, digits)
}

function random_triangle(): Vector[] {
    return [
        random.next_vector_from_unit_sphere_volume(), 
        random.next_vector_from_unit_sphere_volume(), 
        random.next_vector_from_unit_sphere_volume()
    ]
}