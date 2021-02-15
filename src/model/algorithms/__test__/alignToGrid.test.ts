import { BrushModel } from "../../BrushModel"
import { Vector } from "../../Vector";
import { align_brush_model_to_grid } from "../alignToGrid";


test('align to grid', () => {
    const brush = new BrushModel();
    brush.addVertex(new Vector(3.163,1.01,9.73));
    const aligned = align_brush_model_to_grid(brush, new Vector(0.1, 1, 4));
    expect(aligned.vertexes[0].position).toMatchObject({ x:3.2, y:1, z:8 });
})