import { BoundingBox } from "../BoundingBox";
import { Vector } from "../Vector";


describe('creation', () => {

    test('create from constraints', () => {
        expect(new BoundingBox({
            min_x: 0,
            max_x: 4
        }))
    })

    test('create from 2 Vectors', () =>
        expect(BoundingBox.from_vectors(
            new Vector(-1, -1, -1),
            new Vector(+1, +1, +1)
        )).toBeTruthy()
    )
})

describe('box around unit', () => {
    const box = BoundingBox.UNIT_BOX

    test('origin is inside', () =>
        expect(box.encloses(0, 0, 0)).toBe(true)
    )

    test('random number is inside', () =>
        expect(box.encloses(0.4, -0.5, 0.9)).toBe(true)
    )

    test('position on edge of the box is inside', () => {
        expect(box.encloses(1, 1, 1)).toBe(true)
        expect(box.encloses(-1, -1, -1)).toBe(true)
    })

    test('random outside position is outside each axis', () => {
        expect(box.encloses(5, 0, 0)).toBe(false)
        expect(box.encloses(0, 5, 0)).toBe(false)
        expect(box.encloses(0, 0, 5)).toBe(false)
        expect(box.encloses(-5, 0, 0)).toBe(false)
        expect(box.encloses(0, -5, 0)).toBe(false)
        expect(box.encloses(0, 0, -5)).toBe(false)
    })

    test('random inside position vector is inside', () =>
        expect(box.encloses_vector(new Vector(0.4, -0.5, 0.9))).toBe(true)
    )

    test('random outside position vector is outside', () =>
        expect(box.encloses_vector(new Vector(4.4, -0.5, 0.9))).toBe(false)
    )

    test('infinity on any axis is outside', () => {
        expect(box.encloses(Infinity, 0, 0)).toBe(false)
        expect(box.encloses(0, Infinity, 0)).toBe(false)
        expect(box.encloses(0, 0, Infinity)).toBe(false)
        expect(box.encloses(-Infinity, 0, 0)).toBe(false)
        expect(box.encloses(0, -Infinity, 0)).toBe(false)
        expect(box.encloses(0, 0, -Infinity)).toBe(false)
    })

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

})

describe('single axis bounds', () => {

    test('x axis inside', () =>
        expect(new BoundingBox({ min_x: 4, max_x: 6 })
            .encloses(5, 4, 9)).toBe(true)
    )

    test('y axis inside', () =>
        expect(new BoundingBox({ min_y: -7, max_y: -5 })
            .encloses(5, -6, 9)).toBe(true)
    )

    test('z axis inside', () =>
        expect(new BoundingBox({ min_z: 9, max_z: 12 })
            .encloses(5, 4, 10)).toBe(true)
    )

    test('x axis outside', () =>
        expect(new BoundingBox({ min_x: 4, max_x: 6 })
            .encloses(3, 4, 9)).toBe(false)
    )

    test('y axis outside', () =>
        expect(new BoundingBox({ min_y: -7, max_y: -5 })
            .encloses(5, -9, 9)).toBe(false)
    )

    test('z axis outside', () =>
        expect(new BoundingBox({ min_z: 9, max_z: 12 })
            .encloses(5, 4, 13)).toBe(false)
    )

})

describe('encloses and intersects relationships', () => {
    [
        {
            name: 'unit box encloses & intersects zero box, but zerob box does not enclose unit box',
            a: BoundingBox.UNIT_BOX,
            b: BoundingBox.ZERO_BOX,
            a_encloses_b: true,
            b_encloses_a: false,
            intersection: true,
        },
        {
            name: 'unit box not encloses infinite box but intersects with it',
            a: BoundingBox.UNIT_BOX,
            b: BoundingBox.INFINITE_BOX,
            a_encloses_b: false,
            b_encloses_a: true,
            intersection: true,
        },
        {
            name: 'boxes with distance between them dont intersect or enclose',
            a: BoundingBox.UNIT_BOX,
            b: BoundingBox.from_vectors(new Vector(3, -1, -1),new Vector(5, 1, 1)),
            a_encloses_b: false,
            b_encloses_a: false,
            intersection: false,
        },
        {
            name: 'boxes touching on x side intersect but does not enclose',
            a: new BoundingBox({ max_x: +1 }),
            b: new BoundingBox({ min_x: +1 }),
            a_encloses_b: false,
            b_encloses_a: false,
            intersection: true,
        },
        {
            name: 'boxes touching on corner intersect but does not enclose',
            a: new BoundingBox({ max_x: 0, max_y: 0, max_z: 0 }),
            b: new BoundingBox({ min_x: 0, min_y: 0, min_z: 0 }),
            a_encloses_b: false,
            b_encloses_a: false,
            intersection: true,
        },
        {
            name: 'partially intersecting buxes intersect but do not enclose',
            a: new BoundingBox({ max_x: +1, max_y: +1, max_z: +1 }),
            b: new BoundingBox({ min_x: -1, min_y: -1, min_z: -1 }),
            a_encloses_b: false,
            b_encloses_a: false,
            intersection: true,
        },
    ].forEach(item => test(item.name, () => {
        expect(item.a.encloses_box(item.b)).toBe(item.a_encloses_b);
        expect(item.b.encloses_box(item.a)).toBe(item.b_encloses_a);
        expect(item.a.intersects(item.b)).toBe(item.intersection);
        expect(item.b.intersects(item.a)).toBe(item.intersection);
    }))
})

describe('intersections', () =>{
    [
        {
            name: 'touching on x side intersect',
            a: new BoundingBox({ max_x: +1 }),
            b: new BoundingBox({ min_x: +1 }),
            intersection: true,
        },
        {
            name: 'touching on y side intersect',
            a: new BoundingBox({ max_y: +1 }),
            b: new BoundingBox({ min_y: +1 }),
            intersection: true,
        },
        {
            name: 'touching on z side intersect',
            a: new BoundingBox({ max_z: +1 }),
            b: new BoundingBox({ min_z: +1 }),
            intersection: true,
        },
        {
            name: 'distanced on x side do not instersect',
            a: new BoundingBox({ max_z: -1 }),
            b: new BoundingBox({ min_z: +1 }),
            intersection: false,
        },
        {
            name: 'distanced on y side do not instersect',
            a: new BoundingBox({ max_z: -1 }),
            b: new BoundingBox({ min_z: +1 }),
            intersection: false,
        },
        {
            name: 'distanced on z side do not instersect',
            a: new BoundingBox({ max_z: -1 }),
            b: new BoundingBox({ min_z: +1 }),
            intersection: false,
        },
    ].forEach(item => test(item.name, () => {
        expect(item.a.intersects(item.b)).toBe(item.intersection);
        expect(item.b.intersects(item.a)).toBe(item.intersection);
    }))
})