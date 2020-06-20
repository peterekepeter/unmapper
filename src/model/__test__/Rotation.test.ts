import { Rotation } from "../Rotation";
import { Vector } from "../Vector";

describe('Rotation', () => {

    test('can be created', () => {
        const r = new Rotation(0,0,0);
        expect(r.pitch).toBe(0);
    })

    test('can be compared', () => {
        const r = new Rotation(0,36,72);
        expect(r.equals(r)).toBe(true);
        expect(r.equals(Rotation.IDENTITY)).toBe(false);
    })

    test('values are wrapped around', () => {
        const r = new Rotation(Rotation.FULL_TURN, 0, 0);
        expect(r.equals(Rotation.IDENTITY)).toBe(true);
    })

    test('add operation', () => {
        const r = new Rotation(Rotation.HALF_TURN, 0, 0).add(Rotation.HALF_TURN, 0, 0);
        expect(r.equals(Rotation.IDENTITY)).toBe(true);
    })

    test('can apply to vector', () => {
        const r = new Rotation(Rotation.QUARTER_TURN);
        const v = r.apply(Vector.FORWARD);
        expect(v).toEqual(Vector.UP);
    });

    test('can apply to vector 2', () => {
        const r = new Rotation(0, Rotation.QUARTER_TURN, 0);
        const v = r.apply(Vector.FORWARD);
        expect(v).toEqual(Vector.RIGHT);
    });

    test('can apply to vector 3', () => {
        const r = new Rotation(0, 0, Rotation.QUARTER_TURN);
        const v1 = r.apply(Vector.FORWARD);
        expect(v1).toEqual(Vector.FORWARD);
        const v2 = r.apply(Vector.RIGHT);
        expect(v2).toEqual(Vector.UP);
    });

});