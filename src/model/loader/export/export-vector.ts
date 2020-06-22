import { Vector } from "../../Vector";
import { exportPaddedFloat } from "./export-number";



export function exportVector(vector : Vector) : string {
    const x = exportPaddedFloat(vector.x);
    const y = exportPaddedFloat(vector.y);
    const z = exportPaddedFloat(vector.z);
    return `${x},${y},${z}`;
}
