import { Vector } from "../../Vector"
import { intersect_segments } from "../intersect_segments"

test("axis lines intersect at zero", () => {
    expect(intersect_segments(v(-1, 0), v(1, 0), v(0, -1), v(0, 1))).toEqual(v(0, 0))
})

test("y=x, y=-x intersect at zero", () => {
    expect(intersect_segments(v(-1, -1), v(1, 1), v(1, -1), v(-1, 1))).toEqual(v(0, 0))
})

test("not intersects, first segment too short", () => {
    expect(intersect_segments(v(-1, 0), v(-0.5, 0), v(0, -1), v(0, 1))).toBeNull()
})

test("not intersects, second segment too short", () => {
    expect(intersect_segments(v(-1, 0), v(1, 0), v(0, -1), v(0, -0.5))).toBeNull()
})

test("not intersects, lines not on same plane", () => {
    expect(intersect_segments(v(-1, 0), v(1, 0), v(0, -1, 1), v(0, 1, 1))).toBeNull()
})

function v(x: number, y: number, z=0){
    return new Vector(x, y, z)
}
