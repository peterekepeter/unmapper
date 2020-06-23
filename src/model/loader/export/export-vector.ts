import { Vector } from "../../Vector";
import { Exporter } from "./Exporter";

export function exportVector(exporter: Exporter, vector : Vector) {
    exporter
        .writePaddedFloat(vector.x).write(',')
        .writePaddedFloat(vector.y).write(',')
        .writePaddedFloat(vector.z);
}
