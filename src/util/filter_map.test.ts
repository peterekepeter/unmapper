import { filter_map } from "./filter_map"

test('filters and maps', () => {
    expect(filter_map([1,2,3,4], n => n%2 === 0, n => n * 2))
        .toEqual([4,8])
})

test('map receives index from original list', () => {
    expect(filter_map(['ab','bc','cd','ac'], s => s.startsWith('a'), (_,i) => i))
        .toEqual([0,3])
})

test('filter receives index from original list', () => {
    expect(filter_map(['ab','bc','cd','ac'], (_, i) => i % 2 === 0, (s) => s))
        .toEqual(['ab','cd'])
})