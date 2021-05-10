import { FixedLCGenerator } from "./FixedLCGenerator"
import { RandomGeneratorCore } from "./RandomGeneratorCore"

let generator: RandomGeneratorCore

beforeEach(() => {
    generator = new FixedLCGenerator()
})

test('generates number', () => {
    const result = generator.generate_next_value()
    expect(result).not.toBeNaN()
    expect(typeof result).toBe('number')
})

test('generates different numbers', () => {
    const set = new Set<number>()
    for (let i = 0; i < 10; i++) {
        const result = generator.generate_next_value()
        set.add(result)
    }
    expect([...set]).toHaveLength(10)
})

test('generates same sequence of numbers when settings the same seed', () => {
    expect(get_n_seeded_numbers(10, 13))
        .toEqual(get_n_seeded_numbers(10, 13))
})

test('generates other sequence of numbers with different seeds', () => {
    expect(get_n_seeded_numbers(10, 13))
        .not.toEqual(get_n_seeded_numbers(10, 42))
})

const N = 10000

describe(`sequence of ${N} random numbers`, () => {

    let numbers: number[]

    beforeAll(() => {
        numbers = []
        for (let i = 0; i < N; i++) {
            numbers.push(generator.generate_next_value())
        }
        Object.freeze(numbers)
    })

    test('each number falls within the expected range', () => {
        const min_value = generator.range[0]
        const max_value = generator.range[1]
        for (const number of numbers) {
            if (number < min_value || number > max_value) {
                // assertion lib has significant overhead here, guard with if
                expect(number).toBeGreaterThanOrEqual(min_value)
                expect(number).toBeLessThanOrEqual(max_value)
            }
        }
    })

    test('no NaNs', () => {
        for (const number of numbers) {
            if (isNaN(number)) {
                // assertion lib has significant overhead here, guard with if
                expect(number).not.toBeNaN()
            }
        }
    })


    test('mean is within 1% error of the middle of the range', () => {

        const mid = (generator.range[0] + generator.range[1]) / 2
        const range_length = generator.range[1] - generator.range[0]
        let sum = 0

        for (const number of numbers) {
            sum += number
        }
        const mean = sum / numbers.length
        expect(mean).toBeGreaterThan(mid - range_length * 0.01)
        expect(mean).toBeLessThan(mid + range_length * 0.01)

    })

    test('median is within 1% error to the middle of the range', () => {

        const mid = (generator.range[0] + generator.range[1]) / 2
        const range_length = generator.range[1] - generator.range[0]

        const sorted = [...numbers].sort((a,b) => a-b)
        const median = sorted[sorted.length / 2]
        expect(median).toBeGreaterThan(mid - range_length * 0.01)
        expect(median).toBeLessThan(mid + range_length * 0.01)

    })

})

function get_n_seeded_numbers(n: number, seed: number): number[] {
    const result = []
    generator.seed = seed
    for (let i = 0; i < n; i++) {
        result.push(generator.generate_next_value())
    }
    return result
}