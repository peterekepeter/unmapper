import { Vector } from "../../Vector"
import { fast_closest_point_to_line, precise_closest_point_to_line } from "../closest_point_to_line"

describe("precise_closest_point_to_line", () => {
    const fn = precise_closest_point_to_line
    test("basic case", () => expect(
        fn(v(-1), v(+1), v(0, -1)),
    ).toEqual(v(0)))
    
    test("basic case 2", () => expect(
        fn(v(-1), v(+1), v(0.25, -1)),
    ).toEqual(v(0.25, 0)))
    
    test("basic case, point far from line", () => expect(
        fn(v(-1), v(+1), v(0.25, -10000)),
    ).toEqual(v(0.25, 0)))
    
    test("basic case, point far from line points", () => expect(
        fn(v(-1), v(+1), v(10000.25, -1)),
    ).toEqual(v(10000.25, 0)))
    
    test("diagonal case", () => expect(
        fn(v(-1, -1), v(+1, +1), v(-1, +1)),
    ).toEqual(v(0, 0)))
    
    test("diagonal case 2", () => expect(
        fn(v(-1, -1), v(+1, +1), v(-1, +1).add_numbers(0.5, 0.5, 0)),
    ).toEqual(v(0.5, 0.5)))
    
    // TODO: improve precision
    test.skip("diagonal case far from line", () => expect(
        fn(v(-1, -1), v(+1, +1), v(-1000, +1000).add_numbers(0.5, 0.5, 0)),
    ).toEqual(v(0.5, 0.5)))
    
    test("slanted case zero", () => expect(
        fn(v(-2, -1), v(+2, +1), v(-1, +2)),
    ).toEqual(v(0, 0)))

    // TODO: improve precision
    test.skip("slanted case nudged", () => expect(
        fn(v(-2, -1), v(+2, +1), v(-1, +2).add_numbers(0.2, 0.1, 0)),
    ).toEqual(v(0.2, 0.1)))
    
})
describe("fast_closest_point_to_line", () => {
    const fn = fast_closest_point_to_line

    test("basic case 2", () => expect(
        fn(v(-1), v(+1), v(0.25, -1)),
    ).toEqual(v(0.25, 0)))
    
    test("diagonal case 2", () => {
        const result = fn(v(-1, -1), v(+1, +1), v(-1, +1).add_numbers(0.5, 0.5, 0))
        expect(result.x).toBeCloseTo(0.5, 10)
        expect(result.y).toBeCloseTo(0.5, 10)
    })

})

function v(x=0, y=0, z=0){
    return new Vector(x, y, z)
}
