import { Exporter } from "./Exporter";
import { Actor } from "../../Actor";
import { exportKeyValueNewline } from "./export-keyvalue";
import { exportNamedObjectVector } from "./export-vector";


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
}

function exportUnsupporterProps(exporter : Exporter, props : any)
{
    for (const key in props){
        const value = props[key];
        exportKeyValueNewline(exporter, key, value);
    }
}
