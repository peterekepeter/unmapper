import { Plane } from "../Plane";
import { RandomNumberGenerator } from "../random/RandomNumberGenerator";
import { RandomVectorGenerator } from "../random/RandomVectorGenerator";
import { Vector } from "../Vector";


test('equals false', () =>
    expect(Plane.YZ.equals(new Plane(new Vector(1, 0, 0), 1))).toBe(false))

test('equals true', () =>
    expect(Plane.YZ.equals(new Plane(new Vector(1, 0, 0), 0))).toBe(true))

test('normal of XY plan is cross product between X and Y', () =>
    expect(Plane.XY.normal.equals(Vector.UNIT_X.cross(Vector.UNIT_Y))).toBe(true))

test('normal of YZ plan is cross product between Y and Z', () =>
    expect(Plane.YZ.normal.equals(Vector.UNIT_Y.cross(Vector.UNIT_Z))).toBe(true))

test('normal of ZX plan is cross product between X and Z', () =>
    expect(Plane.ZX.normal.equals(Vector.UNIT_Z.cross(Vector.UNIT_X))).toBe(true))

test('signed distance', () => {
    for (let i=-3; i<3; i++){
        expect(Plane.XY.signed_distance_to_point(Vector.UNIT_Z.scale(i))).toBe(i)
        expect(Plane.YZ.signed_distance_to_point(Vector.UNIT_X.scale(i))).toBe(i)
        expect(Plane.ZX.signed_distance_to_point(Vector.UNIT_Y.scale(i))).toBe(i)
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

describe('constructing plane from normal and position', () => {

    test('planes are equal if positions are on same plane', () => {
        expect(new Plane(Vector.UNIT_Z, new Vector(0,0,0)))
            .toEqual(new Plane(Vector.UNIT_Z, new Vector(1,-4,0)))
    })

    test('fuzz distance to point is correct', () => {
        const generator = new RandomVectorGenerator()
        const random = new RandomNumberGenerator()
        for (let i=0; i<10; i++){
            const normal = generator.next_vector_from_unit_sphere_surface()
            const distance = random.next_float_in_range(-10, 10)
            const position = normal.scale(distance)
            const plane = new Plane(normal, position)
            expect(plane.signed_distance_to_point(position))
                .toBeCloseTo(0, 10)
        }
    })

})

test("fuzz correct plane is generated when generating plane from normal and position", () =>{
    const normal = new Vector(1,1,0).normalize()
    const generator = new RandomNumberGenerator()
    for (let i=0; i<10; i++){
        const u = generator.next_float_in_range(-1,1)
        const v = generator.next_float_in_range(-1,1)
        const distance = generator.next_float_in_range(0,1)
        const position = new Vector(0,0,1).scale(u)
            .add_vector(new Vector(-1,1,0).scale(v))
            .add_vector(normal.scale(distance))
        const plane = new Plane(normal, position)
        expect(plane.distance).toBeCloseTo(distance, 10)
    }
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