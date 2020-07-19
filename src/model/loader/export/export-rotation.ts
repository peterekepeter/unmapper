import { Exporter } from "./Exporter";
import { Rotation } from "../../Rotation";
import { DEGREES_FULL_TURN, UNREAL_FULL_TURN } from "../../ExtendedMath";
import { degreesToUnrealAngle } from "../converter/convert-angles";

export function exportRotationNewline(exporter : Exporter, name = "Rotation", rotation : Rotation){
    if (rotation === Rotation.IDENTITY){
        return;
    }
    exporter.write(name).write('=(');
    let separator = '';
    if (rotation.pitch !== Rotation.IDENTITY.pitch){
        exporter.write(separator);
        exporter.write('Pitch=');
        exporter.writeInt(degreesToUnrealAngle(rotation.pitch));
        separator = ',';
    }
    if (rotation.yaw !== Rotation.IDENTITY.yaw){
        exporter.write(separator);
        exporter.write('Yaw=');
        exporter.writeInt(degreesToUnrealAngle(rotation.yaw));
        separator = ',';
    }
    if (rotation.roll !== Rotation.IDENTITY.roll){
        exporter.write(separator);
        exporter.write('Roll=');
        exporter.writeInt(degreesToUnrealAngle(rotation.roll));
        separator = ',';
    }
    exporter.write(')');
}