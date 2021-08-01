import { Vector } from "../../../Vector"
import { exportVector } from "../export-vector"
import { Exporter } from "../Exporter"

test('export to vector format', () => {
    expect(exporting(new Vector(128, 128, 0)))
        .toBe("+00128.000000,+00128.000000,+00000.000000")
})

test('negative numbers', () => {
    expect(exporting(new Vector(-128, 128, -1)))
        .toBe("-00128.000000,+00128.000000,-00001.000000")
})

test('fractional numbers', () => {
    expect(exporting(new Vector(0.125, -0.5, -0.333333)))
        .toBe("+00000.125000,-00000.500000,-00000.333333")
})

test('numbers close to integer', () => {
    expect(exporting(new Vector(128.000000000084217, 127.99999999998,128.0000001)))
        .toBe("+00128.000000,+00128.000000,+00128.000000")
})

function exporting(vector : Vector) : string {
    const exporter = new Exporter()
    exportVector(exporter, vector)
    return exporter.toString()
}