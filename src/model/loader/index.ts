import { UnrealMap } from "../UnrealMap"
import { importUnrealMap } from "./import/import-unreal-map";
import { Exporter } from "./export/Exporter";
import { exportUnrealMap } from "./export/export-unreal-map";


export function loadMapFromString(input : string) : UnrealMap {
    return importUnrealMap(input);
}

export function storeMapToString(map : UnrealMap) : string { 
    const exporter = new Exporter();
    exportUnrealMap(exporter, map);
    return exporter.toString();
}