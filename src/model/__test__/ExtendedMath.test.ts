import { clamp, cos_degrees, fmod, nearest_power_of_two, round_to_precision, sin_degrees } from "../ExtendedMath"

describe('ExtendedMath', () => {

    describe('fmod', () => {
        [
            [0, 1, 0],
            [0.5, 1, 0.5],
            [1.5, 1, 0.5],
            [100000.5, 1, 0.5],
            [10, 360, 10],
            [-10, 360, 350],
        ]
            .forEach(([input, modulo, result]) =>
                test(`fmod(${input}, ${modulo}) is ${result}`, () =>
                    expect(fmod(input, modulo))
                        .toBe(result)))
    })

    describe('clamp', () => {
        [
            [0, -1, 2, 0],
            [0, 0, 2, 0],
            [0, 1, 2, 1],
            [0, 2, 2, 2],
            [0, 3, 2, 2],
        ]
            .forEach(([min, value, max, result]) =>
                test(`clamp(${min}, ${value}, ${max}) is ${result}`, () =>
                    expect(clamp(min, value, max))
                        .toBe(result)))
    })

    // high precision approximations from wolfram alpha:
    const sin60 = 0.866025403784438646763723170752936183471402626905190314027
    const sin45 = 0.707106781186547524400844362104849039284835937688474036588
    const sin22dot5 = 0.382683432365089771728459984030398866761344562485627041433
    const sin11dot25 = 0.195090322016128267848284868477022240927691617751954807754

    // ensure precision at commonly used angles
    describe('sinDegrees', () => {
        [
            // common angles
            [0, 0],
            [11.25, sin11dot25],  // 1/32
            [22.5, sin22dot5], // 1/16
            [30, 0.5],   // 1/12
            [45, sin45], // 1/8
            [60, sin60], // 1/6
            [90, 1],     // 1/4
            [135, sin45],
            [180, -0],    // 1/2 (-0 === 0)
            [270, -1],
            [360, 0],

            // wrapping test
            [360 + 45, sin45], 
            [360 + 135, sin45], 
            [-360 + 45, sin45], 
            [-360 + 135, sin45], 
        ]
            .forEach(([degrees, result]) =>
                test(`sinDegrees(${degrees}) is ${result}`, () =>
                    expect(sin_degrees(degrees)).toEqual(result)))
    })

    describe('cosDegrees', () => {
        [
            // common angles
            [0, 1],
            [60, 0.5],
            [90, 0],
            [180, -1],
            [270, -0],
            [360 + 60, 0.5],
        ]
            .forEach(([degrees, result]) =>
                test(`cosDegrees(${degrees}) is ${result}`, () =>
                    expect(cos_degrees(degrees)).toEqual(result)))
    })

    describe('nearest_power_of_two', () => {
        const fn = nearest_power_of_two

        test("returns itself if power of two", () => {
            expect(fn(0.25)).toBe(0.25)
            expect(fn(0.5)).toBe(0.5)
            expect(fn(1)).toBe(1)
            expect(fn(2)).toBe(2)
            expect(fn(4)).toBe(4)
        })

        test("return itself for negative powers of two", () => {
            expect(fn(-0.25)).toBe(-0.25)
            expect(fn(-4)).toBe(-4)
        })

        test("return zero for zero", () => expect(fn(0)).toBe(0))

        test("return NaN for Nan", () => expect(fn(NaN)).toBe(NaN))

        test("return -Inf for -Inf", () => expect(fn(-Infinity)).toBe(-Infinity))
        
        test("return +Inf for +Inf", () => expect(fn(+Infinity)).toBe(+Infinity))

        test("rounds to nearest power", () => {
            expect(fn(2.01)).toBe(2)
            expect(fn(1.99)).toBe(2)
        })

        test("rounds to nearest negative power", () => {
            expect(fn(-2.01)).toBe(-2)
            expect(fn(-1.99)).toBe(-2)
        })
    })

    describe('round_to_precision', () => {
        const fn = round_to_precision
        
        test("round to integer", () => expect(fn(16.24, 1.0)).toBe(16.0) )
        
        test("round to fractional", () => expect(fn(16.24, 0.25)).toBe(16.25) )

        test("round to infinite precision returns same number", () => expect(fn(3.14159, 0)).toBe(3.14159))
    })

})
