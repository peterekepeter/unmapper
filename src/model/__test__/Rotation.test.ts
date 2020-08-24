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

    test('90 deg pitch rotation to forward produces up vector', () => {
        const r = new Rotation(Rotation.QUARTER_TURN);
        const v = r.apply(Vector.FORWARD);
        expect(v).toEqual(Vector.UP);
    });

    test('90 deg yaw rotation to forward produces right vector', () => {
        const r = new Rotation(0, Rotation.QUARTER_TURN, 0);
        const v = r.apply(Vector.FORWARD);
        expect(v).toEqual(Vector.RIGHT);
    });

    test('90 deg roll rotation to forward produces no change', () => {
        const r = new Rotation(0, 0, Rotation.QUARTER_TURN);
        const v1 = r.apply(Vector.FORWARD);
        expect(v1).toEqual(Vector.FORWARD);
    });

    test('90 deg roll rotation to right produces down vector', () => {
        const r = new Rotation(0, 0, Rotation.QUARTER_TURN);
        const v2 = r.apply(Vector.RIGHT);
        expect(v2).toEqual(new Vector(0,0,-1));
    });


});