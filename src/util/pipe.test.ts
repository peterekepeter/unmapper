import { pipe } from "./pipe"

test('pipe', () => {
    function double(x: number): number {
        return x * 2
    }
    function add_one(x: number): number {
        return x + 1
    }
    const composed_fn = pipe(double, add_one)
    expect(composed_fn(2)).toBe(5)
})