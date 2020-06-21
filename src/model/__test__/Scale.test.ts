import { Scale } from "../Scale";
import { Vector } from "../Vector";


test('basic scaling', () => {
    expect(
        new Scale(new Vector(3, 2, -4))
            .toMatrix()
            .apply(new Vector(1, 1, 1))
    ).toEqual(new Vector(3, 2, -4));
});