import { Vector } from "../Vector"


describe('Vector', () => {

    test('constructor accepts coords', () => 
        expect(new Vector(3,4,5)).toEqual({x:3, y:4, z:5}))

    test('zero vector defined', () => 
        expect(Vector.ZERO).toEqual({x:0, y:0, z:0}))

    test('xUnit is defined', () => 
        expect(Vector.UNIT_X).toEqual({x:1, y:0, z:0}))

    test('yUnit is defined', () => 
        expect(Vector.UNIT_Y).toEqual({x:0, y:1, z:0}))

    test('zUnit is defined', () => 
        expect(Vector.UNIT_Z).toEqual({x:0, y:0, z:1}))

    test('addition',() =>
        expect(new Vector(3,2,1).add_numbers(1,2,3)).toEqual({x:4,y:4,z:4}))
    
    test('subtraction',() =>
        expect(new Vector(3,2,1).subtract_numbers(1,2,3)).toEqual({x:2,y:0,z:-2}))

    test('can be scaled',() =>
        expect(new Vector(3,2,1).scale(0.5)).toEqual({x:1.5,y:1,z:0.5}))

    test('can be created from array',() =>
        expect(Vector.from_array([1,2,3])).toEqual({x:1,y:2,z:3}))

    test('equals true', () =>
        expect(new Vector(1,2,3).equals(new Vector(1,2,3))).toBe(true))

    test('equals false', () =>
        expect(new Vector(1,2,3).equals(new Vector(3,1,2))).toBe(false))

    test('crossProduct 1', () => 
        expect(Vector.cross_product(Vector.FORWARD, Vector.RIGHT)).toEqual(Vector.UP))

    test('crossProduct 2', () => 
        expect(Vector.cross_product(Vector.FORWARD, Vector.UP)).toEqual(Vector.RIGHT))

    test('crossProduct 2', () => 
        expect(Vector.cross_product(Vector.RIGHT, Vector.UP)).toEqual(Vector.FORWARD))

    test('dot product parallel same direction', () => 
        expect(Vector.dot_product(Vector.UP, Vector.UP)).toBe(1))

    test('dot product parallel opposite direction', () => 
        expect(Vector.dot_product(Vector.UP, Vector.DOWN)).toBe(-1))

    test('dot product perpenticular', () => 
        expect(Vector.dot_product(Vector.UP, Vector.FORWARD)).toBe(0))

    test('normalize x', () => expect(
        new Vector(4,0,0).normalize()).toEqual(new Vector(1,0,0)))
        
    test('normalize xy', () => expect(
        new Vector(1,1,0).normalize()).toEqual(new Vector(1/Math.sqrt(2),1/Math.sqrt(2),0)))

    test('length of UP is 1', () => 
        expect(Vector.UP.length()).toBe(1))

    test('length of LEFT is 1', () => 
        expect(Vector.LEFT.length()).toBe(1))

    test('length of RIGHT is 1', () => 
        expect(Vector.RIGHT.length()).toBe(1))

    test('length of ZERO is 0', () => 
        expect(Vector.ZERO.length()).toBe(0))

    test('length is euler distance', () => 
        expect(new Vector(3,4,0).length()).toBe(5))

    test('distanceTo on same line', () => 
        expect(new Vector(1,0,0).distance_to(new Vector(3,0,0))).toBe(2))

    test('distanceTo is euler distance ', () => 
        expect(new Vector(3,0,0).distance_to(new Vector(0,0,4))).toBe(5))

    test('vectorTo on x axis', () => 
        expect(new Vector(1,0,0).vector_to(4,0,0)).toEqual(new Vector(3,0,0)))

    test('vectorToVector on x axis', () => 
        expect(new Vector(1,0,0).vector_to_vector(new Vector(4,0,0))).toEqual(new Vector(3,0,0)))

})
    