import { exportInt, exportAngleDegrees, exportFloat, exportPaddedFloat } from "../export-number";

test('export int positive', () =>
    expect(exportInt(4)).toBe('4'));

test('export int negative', () =>
    expect(exportInt(-4)).toBe('-4'));

test('export int performs rounding', () =>
    expect(exportInt(-4.2)).toBe('-4'));

test('exportAngleDegrees converts units', () =>
    expect(exportAngleDegrees(360)).toBe("65536"));

test('exportAngleDegrees performs rounding', () =>
    expect(exportAngleDegrees(60)).toBe("10923"));

test('exportAngleDegrees negative', () =>
    expect(exportAngleDegrees(-90)).toBe("-16384"));

test('exportFloat', () =>
    expect(exportFloat(144)).toBe("144.000000"));

test('exportFloat negative', () =>
    expect(exportFloat(-16)).toBe("-16.000000"));

test('exportPaddedFloat', () =>
    expect(exportPaddedFloat(85.218842))
        .toBe("+00085.218842"))

test('exportPaddedFloat negative', () =>
    expect(exportPaddedFloat(-75.256027))
        .toBe("-00075.256027"))

test('exportPaddedFloat zero', () =>
    expect(exportPaddedFloat(0))
        .toBe("+00000.000000"))