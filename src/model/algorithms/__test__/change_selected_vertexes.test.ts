import { BrushModel } from "../../BrushModel"
import { Vector } from "../../Vector"
import { change_selected_vertexes } from "../change_selected_vertexes"


describe('change_selected_vertexes with 2 vertexes', () => {
    let initial: BrushModel
    let result: BrushModel

    beforeAll(() => {
        initial = new BrushModel()
        initial.addVertex(new Vector(0, 1, 0))
        initial.addVertex(new Vector(1, 0, 0), true)
        result = change_selected_vertexes(initial, v => v.scale(2))
    })

    test('result has same number of vertexes as the input',
        () => expect(result.vertexes).toHaveLength(initial.vertexes.length))

    test('vertex is not changed if not selected',
        () => expect(result.vertexes.filter(v => !v.selected))
            .toEqual(initial.vertexes.filter(v => !v.selected)))

    test('selected vertex is scaled as expected',
        () => expect(result.vertexes[1].position).toEqual(new Vector(2, 0, 0)))

    test('vertex selection is not changed',
        () => expect(result.vertexes.map(v => v.selected))
            .toEqual(initial.vertexes.map(v => v.selected)))

})