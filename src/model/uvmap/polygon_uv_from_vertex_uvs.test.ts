import { RandomVectorGenerator } from "../random/RandomVectorGenerator"
import { Vector } from "../Vector"
import { get_vertex_uv, polygon_uv_from_vertex_uvs } from "./vertex_uv"




test.skip('UV origin is correctly found for random triangle', () => {
    for (let i = 0; i < 10; i++) {
        const random = new RandomVectorGenerator()
        random.seed = i
        const a = random.next_vector_from_unit_sphere_volume()
        const b = random.next_vector_from_unit_sphere_volume()
        const c = random.next_vector_from_unit_sphere_volume()
        const uv_a = Vector.ZERO
        const uv_b = Vector.UNIT_X
        const uv_c = Vector.UNIT_Y

        try {
            expect(polygon_uv_from_vertex_uvs([a, b, c], [uv_a, uv_b, uv_c]).origin).toEqual(a)
            expect(polygon_uv_from_vertex_uvs([a, b, c], [uv_b, uv_a, uv_c]).origin).toEqual(b)
            expect(polygon_uv_from_vertex_uvs([a, b, c], [uv_b, uv_b, uv_a]).origin).toEqual(c)
        } catch (error) {
            console.log('failed case:', { a, b, c, uv_a, uv_b, uv_c })
            throw error
        }
    }
})

test.skip('UV is correctly found for random triangle', () => {
    for (let i = 0; i < 10; i++) {
        const random = new RandomVectorGenerator()
        random.seed = i
        const a = random.next_vector_from_unit_sphere_volume()
        const b = random.next_vector_from_unit_sphere_volume()
        const c = random.next_vector_from_unit_sphere_volume()
        const uv_a = Vector.ZERO
        const uv_b = Vector.UNIT_X
        const uv_c = Vector.UNIT_Y
        const polygon_uv = polygon_uv_from_vertex_uvs([a, b, c], [uv_a, uv_b, uv_c])

        try {
            expect_vector_close_to(get_vertex_uv(polygon_uv, a), uv_a, 5)
            expect_vector_close_to(get_vertex_uv(polygon_uv, b), uv_b, 5)
            expect_vector_close_to(get_vertex_uv(polygon_uv, c), uv_c, 5)
        } catch (error) {
            console.log('failed case:', { a, b, c, uv_a, uv_b, uv_c })
            throw error
        }
    }
})

function expect_vector_close_to(received: Vector, expected: Vector, digits = 2) {
    expect(received.x).toBeCloseTo(expected.x, digits)
    expect(received.y).toBeCloseTo(expected.y, digits)
    expect(received.z).toBeCloseTo(expected.z, digits)
}