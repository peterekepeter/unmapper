import { importScale } from "../import-scale"
import { Scale } from "../../../Scale"
import { Vector } from "../../../Vector"
import { SheerAxis } from "../../../SheerAxis"

test('import scale works', () => {
    expect(importScale(
        '(Scale=(X=2.000000,Y=2.000199),SheerAxis=SHEER_ZX)'))
    .toEqual(new Scale(
        new Vector(2.000000,2.000199,1), SheerAxis.SheerZX, 0));
})