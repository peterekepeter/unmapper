import { Vector } from "./Vector";


describe('Vector', () => {
    test('can be instantiated', () => {
        const a = new Vector();
        expect(a).not.toBe(null);
    });
})
