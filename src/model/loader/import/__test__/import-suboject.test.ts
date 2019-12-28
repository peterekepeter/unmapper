import { importSubobject } from "../import-subobject";

test("can import suboject", () => {
    const obj = importSubobject("(SheerAxis=SHEER_ZX)")
    expect(obj).not.toBeNull();
    expect(typeof obj).toBe('object');
});

test("imported suboject contains property", () => {
    const obj = importSubobject("(SheerAxis=SHEER_ZX)")
    expect(obj.SheerAxis).not.toBeNull();
    expect(obj.SheerAxis).toBe('SHEER_ZX');
});

test("imported subobject can have multiple properties", () => {
    const obj = importSubobject("(X=1296.000000,Y=-1392.000000,Z=-144.000000)")
    expect(obj).toEqual({X:"1296.000000", Y:"-1392.000000", Z:"-144.000000"})
});