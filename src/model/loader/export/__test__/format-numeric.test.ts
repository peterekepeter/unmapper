import { formatInt, formatAngle, formatFloat, formatPaddedFloat } from "../format-numeric";

test('export int positive', () =>
    expect(formatInt(4)).toBe('4'));

test('export int negative', () =>
    expect(formatInt(-4)).toBe('-4'));

test('export int performs rounding', () =>
    expect(formatInt(-4.2)).toBe('-4'));

test('exportAngleDegrees converts units', () =>
    expect(formatAngle(360)).toBe("65536"));

test('exportAngleDegrees performs rounding', () =>
    expect(formatAngle(60)).toBe("10923"));

test('exportAngleDegrees negative', () =>
    expect(formatAngle(-90)).toBe("-16384"));

test('exportFloat', () =>
    expect(formatFloat(144)).toBe("144.000000"));

test('exportFloat negative', () =>
    expect(formatFloat(-16)).toBe("-16.000000"));

test('exportPaddedFloat', () =>
    expect(formatPaddedFloat(85.218842))
        .toBe("+00085.218842"))

test('exportPaddedFloat negative', () =>
    expect(formatPaddedFloat(-75.256027))
        .toBe("-00075.256027"))

test('exportPaddedFloat zero', () =>
    expect(formatPaddedFloat(0))
        .toBe("+00000.000000"))