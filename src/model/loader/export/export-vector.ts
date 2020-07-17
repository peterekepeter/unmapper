import { Vector } from "../../Vector";
import { Exporter } from "./Exporter";

export function exportVector(exporter: Exporter, vector : Vector) {
    exporter
        .writePaddedFloat(vector.x).write(',')
        .writePaddedFloat(vector.y).write(',')
        .writePaddedFloat(vector.z);
}

export function exportNamedObjectVectorNewline(exporter : Exporter, name : string, vector: Vector){
    if (vector == null || vector.equals(Vector.ZERO)){
        return;
    }
    exportNamedObjectVector(exporter, name, vector);
    exporter.newline();
}

export function exportNamedObjectVector(exporter : Exporter, name : string, vector: Vector){
    if (vector == null || vector.equals(Vector.ZERO)){
        return;
    }
    exporter.write(name).write('=(');
    let separator = '';
    if (vector.x !== 0){
        exporter.write(separator).write("X=").writeFloat(vector.x);
        separator = ',';
    }
    if (vector.y !== 0){
        exporter.write(separator).write("Y=").writeFloat(vector.y);
        separator = ',';
    }
    if (vector.z !== 0){
        exporter.write(separator).write("Z=").writeFloat(vector.z);
    }
    exporter.write(")");
}
