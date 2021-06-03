import { Plane } from "../Plane";
import { Vector } from "../Vector";


test('equals false', () =>
    expect(Plane.YZ.equals(new Plane(new Vector(1, 0, 0), 1))).toBe(false))

test('equals true', () =>
    expect(Plane.YZ.equals(new Plane(new Vector(1, 0, 0), 0))).toBe(true))

test('normal of XY plan is cross product between X and Y', () =>
    expect(Plane.XY.normal.equals(Vector.UNIT_X.cross(Vector.UNIT_Y))).toBe(true))

test('normal of YZ plan is cross product between Y and Z', () =>
    expect(Plane.YZ.normal.equals(Vector.UNIT_Y.cross(Vector.UNIT_Z))).toBe(true))

test('normal of XZ plan is cross product between X and Z', () =>
    expect(Plane.XZ.normal.equals(Vector.UNIT_X.cross(Vector.UNIT_Z))).toBe(true))

test('signed distance', () => {
    for (let i=-3; i<3; i++){
        expect(Plane.XY.signed_distance_to_point(Vector.UNIT_Z.scale(i))).toBe(i)
        expect(Plane.YZ.signed_distance_to_point(Vector.UNIT_X.scale(i))).toBe(i)
        expect(Plane.XZ.signed_distance_to_point(Vector.UNIT_Y.scale(i))).toBe(i)
    }
})

test('XY plane is not in front of UNIT_Z', () => {
    expect(Plane.XY.is_in_front_of_point(Vector.UNIT_Z)).toBe(false)
})

test('XY plane is in front of UNIT_NEGATIVE_Z', () => {
    expect(Plane.XY.is_in_front_of_point(Vector.UNIT_NEGATIVE_Z)).toBe(true)
})

test('normal cannot be zero vector', () => 
    expect(() => new Plane(Vector.ZERO, 0)).toThrow())

test('distance cannot be negative', () => 
    expect(() => new Plane(Vector.UNIT_X, -4)).toThrow())

describe('constructing plane from normal and position', () => {

    test('planes are equal if positions are on same plane', () => {
        expect(new Plane(Vector.UNIT_Z, new Vector(0,0,0)))
            .toEqual(new Plane(Vector.UNIT_Z, new Vector(1,-4,0)))
    })

})

describe('intersect segment', () => {

    test('returns null if all points are in front', () => {
        expect(Plane.XY.intersect_segment(
            Vector.UNIT_Z.scale(1), Vector.UNIT_Z.scale(2)))
            .toBe(null)
    })

    test('returns null if all points are behind', () => {
        expect(Plane.XY.intersect_segment(
            Vector.UNIT_Z.scale(-1), Vector.UNIT_Z.scale(-2)))
            .toBe(null)
    })

    test('return instersection point', () => {
        expect(Plane.XY.intersect_segment(
            Vector.UNIT_Z.scale(-1), Vector.UNIT_Z.scale(2)))
            .toEqual(Vector.ZERO)
    })

}) 

describe('ray intersection', () => {

    test('returns null if there is no intersection', () => {
        expect(Plane.XY.ray_intersection(Vector.UNIT_Z, Vector.UNIT_X))
            .toBe(null)
    })

    test('returns positive number if plane in front of ray', () => {
        expect(Plane.XY.ray_intersection(Vector.UNIT_Z, Vector.UNIT_NEGATIVE_Z)).toBe(1)
    })

    test('returns negative number if plane in behind of ray', () => {
        expect(Plane.XY.ray_intersection(Vector.UNIT_Z, Vector.UNIT_Z)).toBe(-1)
    })

})