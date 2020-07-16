import { Exporter } from "./Exporter";
import { Actor } from "../../Actor";
import { exportKeyValueNewline } from "./export-keyvalue";
import { exportNamedObjectVector } from "./export-vector";
import { csgOperationToString } from "../converter/convert-CsgOperation";
import { exportScaleNewline } from "./export-scale";


export function exportActor(exporter : Exporter, actor : Actor)
{
    exporter.write("Begin Actor");
    exporter.write(" Class=").writeString(actor.className);
    if (actor.name !== Actor.DEFAULT_ACTOR_NAME){
        exporter.write(" Name=").writeString(actor.name);
    }
    exporter.increaseIndent();
    exporter.newline();
    exportUnsupporterProps(exporter, actor.unsupportedProperties);
    exportSupportedProps(exporter, actor);
    exporter.decraseIndent();
    exporter.write("End Actor");
    exporter.newline();
}

function exportSupportedProps(exporter : Exporter, actor: Actor){
    exportNamedObjectVector(exporter, "Location", actor.location);
    exportNamedObjectVector(exporter, "OldLocation", actor.oldLocation);
    exportKeyValueNewline(exporter, "CsgOper", csgOperationToString(actor.csgOperation));
    exportScaleNewline(exporter, "MainScale", actor.mainScale);
    exportScaleNewline(exporter, "PostScale", actor.postScale);
    exportScaleNewline(exporter, "TempScale", actor.tempScale);
}

function exportUnsupporterProps(exporter : Exporter, props : any)
{
    for (const key in props){
        const value = props[key];
        exportKeyValueNewline(exporter, key, value);
    }
}
