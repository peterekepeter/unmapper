import { BrushModel } from "../../BrushModel"
import { BrushModelBuilder } from "../../BrushModelBuilder"
import { change_selected_vertexes } from "../../state"
import { Vector } from "../../Vector"


describe('change_selected_vertexes with 2 vertexes', () => {
    let initial: BrushModel
    let result: BrushModel

    beforeAll(() => {
        const builder = new BrushModelBuilder()
        builder.add_vertex_coords(0, 1, 0)
        builder.add_vertex_coords(1, 0, 0)
        initial = builder.build()
        result = change_selected_vertexes(initial, [1], v => v.scale(2))
    })

    test('result has same number of vertexes as the input',
        () => expect(result.vertexes).toHaveLength(initial.vertexes.length))

    test('vertex is not changed if not selected',
        () => expect(result.vertexes[0])
            .toEqual(initial.vertexes[0]))

    test('selected vertex is scaled as expected',
        () => expect(result.vertexes[1].position).toEqual(new Vector(2, 0, 0)))

})