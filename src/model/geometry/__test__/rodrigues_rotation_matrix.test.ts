import { Vector } from "../../Vector"
import { rodrigues_rotation_matrix } from "../rodrigues_rotation_matrix"

const rotation_cases = [
    { 
        input: new Vector(0, 1, 0),
        axis: new Vector(0, 0, 1),
        angle: -90,
        output: new Vector(1, 0, 0)
    },
    {
        input: new Vector(1, 0, 0),
        axis: new Vector(0, 1, 0),
        angle: -90,
        output: new Vector(0, 0, 1)
    },
    {
        input: new Vector(1, 0, 0),
        axis: new Vector(1, 1, 1).normalize(),
        angle: 360,
        output: new Vector(1, 0, 0)
    }
]

rotation_cases.forEach(({ input, axis, angle, output }) => {

    describe(`rotate ${input} ${angle}deg around ${axis}`, () => {

        const input_magnitude = input.length()
        const matrix = rodrigues_rotation_matrix(axis, angle)
        const mat_result = matrix.apply(input)
        const mat_result_magnitude = mat_result.length()

        test('matrix rotation should preserve magnitude',
            () => expect(mat_result_magnitude).toEqual(input_magnitude))

        test(`matrix results in ${output}`, 
            () => expect(mat_result).toEqual(output))

    })
})