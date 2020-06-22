import { Vector } from "../../../Vector"
import { exportVector } from "../export-vector";

test('export to vector format', () => {
    expect(exportVector(new Vector(128, 128, 0)))
        .toBe("+00128.000000,+00128.000000,+00000.000000");
})

test('negative numbers', () => {
    expect(exportVector(new Vector(-128, 128, -1)))
        .toBe("-00128.000000,+00128.000000,-00001.000000");
})

test('fractional numbers', () => {
    expect(exportVector(new Vector(0.125, -0.5, -0.333333)))
        .toBe("+00000.125000,-00000.500000,-00000.333333");
})