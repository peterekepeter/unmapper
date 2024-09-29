import { find_nice_ratio } from "./align_to_pixel";


describe(find_nice_ratio, () => {
    const fn = find_nice_ratio;

    test.each([
        [1, [1,1]],
        [2, [2,1]],
        [0.5, [1,2]],
        [0.24, [1,4]],
        [0.12, [1,8]],
        [1.5, [1.5,1]],
        [1/255.123, [1,256]],
    ])("for %s is %s", (input, expected) => {
        expect(fn(input)).toEqual(expected);
    })

})
