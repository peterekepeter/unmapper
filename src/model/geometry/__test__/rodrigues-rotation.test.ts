import { Vector } from "../../Vector";
import { rodrigues_rotation_function, rodrigues_rotation_matrix } from "../rodrigues-rotation";


const test_cases = [
    // { // rotation fn does not preserve magnitude
    //     input: new Vector(1, 0, 0),
    //     axis: new Vector(1, 1, 1).normalize(),
    //     angle: -90,
    //     output: new Vector(0, 1, 0)
    // },
    // { // different results between fn and matrix
    //     input: new Vector(0, 1, 0),
    //     axis: new Vector(0, 0, 1),
    //     angle: -90,
    //     output: new Vector(1, 0, 0)
    // },
    // { // different results between fn and matrix
    //     input: new Vector(1, 0, 0),
    //     axis: new Vector(0, 1, 0),
    //     angle: -90,
    //     output: new Vector(0, 0, 1)
    // },
    {
        input: new Vector(1, 0, 0),
        axis: new Vector(1, 1, 1).normalize(),
        angle: 360,
        output: new Vector(1, 0, 0)
    }
]

test_cases.forEach(({ input, axis, angle, output }) => {

    describe(`rotate ${input} ${angle}deg around ${axis}`, () => {

        const fn = rodrigues_rotation_function(axis, angle)
        const input_magnitude = input.length()
        const fn_result = fn(input)
        const fn_result_magnitude = fn_result.length()
        const matrix = rodrigues_rotation_matrix(axis, angle)
        const mat_result = matrix.apply(input)
        const mat_result_magnitude = mat_result.length()

        test('rotation function should preserve magnitude',
            () => expect(fn_result_magnitude).toEqual(input_magnitude))

        test('matrix rotation should preserve magnitude',
            () => expect(mat_result_magnitude).toEqual(input_magnitude))

        test(`with fn results in ${output}`, 
            () => expect(fn_result).toEqual(output))

        test(`matrix results in ${output}`, 
            () => expect(mat_result).toEqual(output))

    })
})