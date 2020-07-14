import { Exporter } from "./Exporter";
import { UnrealMap } from "../../UnrealMap";
import { exportActor } from "./export-actor";

export function exportUnrealMap(exporter : Exporter, map : UnrealMap) {
    exporter.write("Begin Map").newline();
    for (const actor of map.actors){
        exportActor(exporter, actor);
    }
    exporter.write("End Map").newline();
}
