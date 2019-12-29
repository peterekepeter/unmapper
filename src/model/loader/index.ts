import { UnrealMap } from "../UnrealMap"
import { importUnrealMap } from "./import/import-unreal-map";


export function loadMapFromString(input : string) : UnrealMap {
    return importUnrealMap(input);
}

export function storeMapToString(map : UnrealMap) : string { 
    return "";
}