import { Vector } from "../Vector";


describe('Vector', () => {

    test('constructor accepts coords', () => 
        expect(new Vector(3,4,5)).toEqual({x:3, y:4, z:5}));

    test('zero vector defined', () => 
        expect(Vector.ZERO).toEqual({x:0, y:0, z:0}));

    test('xUnit is defined', () => 
        expect(Vector.UNIT_X).toEqual({x:1, y:0, z:0}));

    test('yUnit is defined', () => 
        expect(Vector.UNIT_Y).toEqual({x:0, y:1, z:0}));

    test('zUnit is defined', () => 
        expect(Vector.UNIT_Z).toEqual({x:0, y:0, z:1}));

    test('addition',() =>
        expect(new Vector(3,2,1).add(1,2,3)).toEqual({x:4,y:4,z:4}));
    
    test('subtraction',() =>
        expect(new Vector(3,2,1).subtract(1,2,3)).toEqual({x:2,y:0,z:-2}));

    test('can be scaled',() =>
        expect(new Vector(3,2,1).scale(0.5)).toEqual({x:1.5,y:1,z:0.5}));

    test('can be created from array',() =>
        expect(Vector.fromArray([1,2,3])).toEqual({x:1,y:2,z:3}));

    test('equals true', () =>
        expect(new Vector(1,2,3).equals(new Vector(1,2,3))).toBe(true))

    test('equals false', () =>
        expect(new Vector(1,2,3).equals(new Vector(3,1,2))).toBe(false))

})
    