import { UnrealMap } from "../UnrealMap"
import { importUnrealMap } from "./import/import-unreal-map";
import { Exporter } from "./export/Exporter";
import { exportUnrealMap } from "./export/export-unreal-map";


export function load_map_from_string(input : string) : UnrealMap {
    return importUnrealMap(input);
}

export function store_map_to_string(map : UnrealMap) : string { 
    const exporter = new Exporter();
    exportUnrealMap(exporter, map);
    return exporter.toString();
}