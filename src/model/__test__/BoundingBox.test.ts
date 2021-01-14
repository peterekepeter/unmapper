import { BoundingBox } from "../BoundingBox";
import { Vector } from "../Vector";

test('create from 2 Vectors', () =>
    expect(new BoundingBox(
        new Vector(-1, -1, -1),
        new Vector(+1, +1, +1)
    )).toBeTruthy()
)

describe('box around unit', () => {
    const box = BoundingBox.UNIT_BOX

    test('origin is inside', () => 
        expect(box.encloses(0,0,0)).toBe(true)
    )

    test('random number is inside', () => 
        expect(box.encloses(0.4,-0.5,0.9)).toBe(true)
    )

    test('position on edge of the box is inside', () => {
        expect(box.encloses(1,1,1)).toBe(true)
        expect(box.encloses(-1,-1,-1)).toBe(true)
    })

    test('random outside position is outside each axis', () => {
        expect(box.encloses(5,0,0)).toBe(false)
        expect(box.encloses(0,5,0)).toBe(false)
        expect(box.encloses(0,0,5)).toBe(false)
        expect(box.encloses(-5,0,0)).toBe(false)
        expect(box.encloses(0,-5,0)).toBe(false)
        expect(box.encloses(0,0,-5)).toBe(false)
    })

    test('random inside position vector is inside', () => 
        expect(box.encloses_vector(new Vector(0.4,-0.5,0.9))).toBe(true)
    )

    test('random outside position vector is outside', () => 
        expect(box.encloses_vector(new Vector(4.4,-0.5,0.9))).toBe(false)
    )

    test('infinity on any axis is outside', () => {
        expect(box.encloses(Infinity,0,0)).toBe(false)
        expect(box.encloses(0,Infinity,0)).toBe(false)
        expect(box.encloses(0,0,Infinity)).toBe(false)
        expect(box.encloses(-Infinity,0,0)).toBe(false)
        expect(box.encloses(0,-Infinity,0)).toBe(false)
        expect(box.encloses(0,0,-Infinity)).toBe(false)
    })

    test('encloses zero box', () => 
        expect(box.encloses_box(BoundingBox.ZERO_BOX)).toBe(true)
    )

    test('not encloses infinite box', () => 
        expect(box.encloses_box(BoundingBox.INFINITE_BOX)).toBe(false)
    )

    test('not encloses outside box', () => 
        expect(box.encloses_box(new BoundingBox(
            new Vector(3,-1,-1), 
            new Vector(5,1,1)))
        ).toBe(false)
    )
});


describe('infinite box', () => {
    const box = BoundingBox.INFINITE_BOX;

    test('origin is inside', () => {
        expect(box.encloses_vector(Vector.ZERO)).toBe(true);
    })

    test('infinite vectors are inside', () => {
        expect(box.encloses_vector(Vector.INFINITY)).toBe(true);
        expect(box.encloses_vector(Vector.NEGATIVE_INFINITY)).toBe(true);
    })

    test('encloses zero box', () => 
        expect(box.encloses_box(BoundingBox.ZERO_BOX)).toBe(true)
    )

    test('encloses unit box', () => 
        expect(box.encloses_box(BoundingBox.UNIT_BOX)).toBe(true)
    )

})