import { distance_to_line_segment } from "../distance-functions"

describe('distance_to_line_segment', () => {

    let x0 : number, y0 : number, x1 : number, y1 : number

    beforeEach(() => {
        x0 = -1; y0 = 0 
        x1 = 1; y1 = 0
    })

    test('distance to center', () => {
        expect(distance(0, 1)).toBe(1)
    })

    test('distance to point', () => {
        expect(distance(1, 1)).toBe(1)
    })

    test('distance beyond point to right', () => {
        expect(distance(2, 0)).toBe(1)
    })

    test('distance beyond point to left', () => {
        expect(distance(-2, 0)).toBe(1)
    })

    test('distance to line at 45 degrees', () => {
        x0=-1; y0=-1
        x1=+1; y1=+1
        expect(distance(-1, +1)).toBe(Math.sqrt(2))
    })

    function distance(x: number, y: number){
        return distance_to_line_segment(x, y, x0, y0, x1, y1)
    }

})
