import { Exporter } from "./Exporter";
import { Scale } from "../../Scale";
import { exportKeyValue } from "./export-keyvalue";
import { sheerAxisToString } from "../converter/convert-SheerAxis";
import { SheerAxis } from "../../SheerAxis";
import { Vector } from "../../Vector";
import { exportNamedObjectVector } from "./export-vector";

export function exportScaleNewline(
    exporter: Exporter,
    name: string,
    scale: Scale) {
    if (scale.isDefault()) {
        return; // nothing to write
    }
    exportScale(exporter, name, scale);
    exporter.newline();
}

export function exportScale(
    exporter: Exporter,
    name: string,
    scale: Scale) {
    if (scale.isDefault()) {
        return; // nothing to write
    }
    exporter.write(name).write('=(');
    let separator = '';
    if (!scale.scale.equals(Vector.ONES)) {
        exporter.write(separator);
        exportNamedObjectVector(exporter, "Scale", scale.scale);
        separator = ',';
    }
    if (scale.sheerAxis !== Scale.DEFAULT_SCALE.sheerAxis) {
        exporter.write(separator);
        exportKeyValue(exporter, "SheerAxis", sheerAxisToString(scale.sheerAxis));
        separator = ',';
    }
    const rate = scale.sheerRate;
    if (Scale.DEFAULT_SCALE.sheerRate !== rate) {
        exporter.write(separator);
        exporter.writeFloat(rate);
        separator = ',';
    }
    exporter.write(')');
}