import { importRotation } from "../import-rotation"
import { Rotation } from "../../../Rotation";

test('import rotation works', () =>
    expect(importRotation('(Yaw=-8192)')).toBeTruthy());


test('import rotation maps value to degrees', () =>
    expect(importRotation('(Yaw=8192)').yaw).toBe(45));

test('import rotation normalizes value', () =>
    expect(importRotation('(Pitch=65536,Yaw=8192,Roll=-65536)'))
        .toEqual(new Rotation(0, 45, 0)));