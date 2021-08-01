import { format_int, format_angle, format_float, format_padded_float } from "../format-numeric"

test('export int positive', () =>
    expect(format_int(4)).toBe('4'))

test('export int negative', () =>
    expect(format_int(-4)).toBe('-4'))

test('export int performs rounding', () =>
    expect(format_int(-4.2)).toBe('-4'))

test('exportAngleDegrees converts units', () =>
    expect(format_angle(360)).toBe("65536"))

test('exportAngleDegrees performs rounding', () =>
    expect(format_angle(60)).toBe("10923"))

test('exportAngleDegrees negative', () =>
    expect(format_angle(-90)).toBe("-16384"))

test('exportFloat', () =>
    expect(format_float(144)).toBe("144.000000"))

test('exportFloat negative', () =>
    expect(format_float(-16)).toBe("-16.000000"))

// TODO: verify how infinity should be serialized
test.skip('exportFloat negative infinity', () =>
    expect(format_float(-Infinity)).toBe("-INF.000000"))

test('exportPaddedFloat', () =>
    expect(format_padded_float(85.218842))
        .toBe("+00085.218842"))

test('exportPaddedFloat negative', () =>
    expect(format_padded_float(-75.256027))
        .toBe("-00075.256027"))

test('exportPaddedFloat zero', () =>
    expect(format_padded_float(0))
        .toBe("+00000.000000"))

test('padded float close to integer is rounded down to integer', () =>
    expect(format_padded_float(128.000000423456))
        .toBe("+00128.000000"))

test('padded float round down to 6th decimal place', () =>
    expect(format_padded_float(127.999999423456))
        .toBe("+00127.999999"))

test('padded float round up to integer', () =>
    expect(format_padded_float(127.999999623456))
        .toBe("+00128.000000"))

// TODO: investigate behaviour with max value
test.skip('clamp to max value', () =>
    expect(format_padded_float(1e31))
        .toBe("+99999.999999"))

test.skip('clamp to min value', () =>
    expect(format_padded_float(-1e31))
        .toBe("-99999.999999"))
    
// TODO: see if we can have additional numeric precision beyond value padding
