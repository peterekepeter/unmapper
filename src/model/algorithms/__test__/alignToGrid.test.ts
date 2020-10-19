import { BrushModel } from "../../BrushModel"
import { Vector } from "../../Vector";
import { alignBrushModelToGrid } from "../alignToGrid";


test('align to grid', () => {
    const brush = new BrushModel();
    brush.addVertex(new Vector(3.163,1.01,9.73));
    const aligned = alignBrushModelToGrid(brush, new Vector(0.1, 1, 4));
    expect(aligned.vertexes[0].position).toMatchObject({ x:3.2, y:1, z:8 });
})