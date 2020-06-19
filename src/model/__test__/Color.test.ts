import { Color } from "../Color";

describe('Color', () => {

    test('can create', () => {
        expect(new Color(15,64,92)).toBeTruthy();
    }) 

    test('has rgb properties', () => {
        const c = new Color(15,64,92);
        expect(c.red).toBe(15);
        expect(c.green).toBe(64);
        expect(c.blue).toBe(92);
    }) 

    test('clamps values', () => {
        const c = new Color(-1,256,92);
        expect(c.red).toBe(0);
        expect(c.green).toBe(255);
        expect(c.blue).toBe(92);
    }) 

    test('rounds values to integer', () => {
        const c = new Color(15.2,64.9,92.5);
        expect(c.red).toBe(15);
        expect(c.green).toBe(65);
        expect(c.blue).toBe(93);
    }) 

    test('can be converted to hex', () => {
        const c = new Color(255,255,255);
        expect(c.toHex()).toBe('#ffffff');
    })

    test('black can be converted to hex', () => {
        const c = new Color(0,0,0);
        expect(c.toHex()).toBe('#000000');
    })

    test('can be created from hex', () => {
        const c = Color.fromHex('#804020');
        expect(c.red).toBe(128);
        expect(c.green).toBe(64);
        expect(c.blue).toBe(32);
    });

    test('can be created from short hex', () => {
        const c = Color.fromHex('#fff');
        expect(c.red).toBe(255);
        expect(c.green).toBe(255);
        expect(c.blue).toBe(255);
    });

    test('can be mixed', () => {
        const black = Color.BLACK;
        const gray = Color.fromHex('#808080');
        expect(black.mix(gray, 0.00).toHex()).toBe('#000000');
        expect(black.mix(gray, 0.25).toHex()).toBe('#202020');
        expect(black.mix(gray, 0.50).toHex()).toBe('#404040');
        expect(black.mix(gray, 0.75).toHex()).toBe('#606060');
        expect(black.mix(gray, 1.00).toHex()).toBe('#808080');
    });
});