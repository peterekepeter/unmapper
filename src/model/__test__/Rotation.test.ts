import { Rotation } from "../Rotation";
import { Vector } from "../Vector";
import { unrealAngleToDegrees } from "../loader/converter/convert-angles";

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

    test('can be applied to vector', () => {
        const r = new Rotation(Rotation.QUARTER_TURN);
        const v = r.apply(Vector.FORWARD);
        expect(v).not.toEqual(Vector.FORWARD);
    });
    
});
