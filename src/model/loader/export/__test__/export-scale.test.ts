import { Scale } from "../../../Scale";
import { Vector } from "../../../Vector";
import { SheerAxis } from "../../../SheerAxis";
import { Exporter } from "../Exporter";
import { exportScale } from "../export-scale";


test('export scale with sheer rate', () => {
    const scale = new Scale(Vector.ONES, SheerAxis.SheerXY, 1.0);
    const exporter = new Exporter();
    exportScale(exporter, "MainScale", scale);
    const result = exporter.toString();
    expect(result).toBe("MainScale=(SheerAxis=SHEER_XY,SheerRate=1.000000)")
});