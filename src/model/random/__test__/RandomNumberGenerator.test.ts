import { RandomNumberGenerator } from "../RandomNumberGenerator"

let random: RandomNumberGenerator

beforeEach(() => random = new RandomNumberGenerator())

test('next value returns random value', () => {
    expect(random.next_value()).not.toBe(random.next_value())
})

test('next value returns same value if same seed was set', () => {
    random.seed = 13
    const value_1 = random.next_value()
    random.seed = 13
    const value_2 = random.next_value()
    expect(value_1).toBe(value_2)
})

test('next_int returns integer in given range', () => {
    for (let i = 0; i < 10; i++) {
        const value = random.next_int(18)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(18)
    }
})

test('next_int_from_range return integer in given range', () => {
    for (let i = 0; i < 10; i++) {
        const value = random.next_int_in_range(9, 18)
        expect(value).toBeGreaterThanOrEqual(9)
        expect(value).toBeLessThan(18)
    }
})

test('next_int_from_range generates all numbers within range', () => {
    const set = new Set<number>()
    for (let i = 0; i < 100; i++) {
        set.add(random.next_int_in_range(17, 20))
        if (set.size === 4) { break }
    }
    expect([...set].sort((a, b) => a - b)).toEqual([17, 18, 19])
})

test('next_float returns value between 0 and 1', () => {
    for (let i = 0; i < 10; i++) {
        const value = random.next_float()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
    }
})

test('next_float_in_Range returns value in range', () => {
    for (let i = 0; i < 10; i++) {
        const value = random.next_float_in_range(10,20)
        expect(value).toBeGreaterThanOrEqual(10)
        expect(value).toBeLessThan(20)
    }
})