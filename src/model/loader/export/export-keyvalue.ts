import { Exporter } from "./Exporter";
import { exportSubobject } from "./export-subobject";

export function exportKeyValueNewline(exporter : Exporter, key: string, value : any, defaultValue? :any)
{
    if (value === defaultValue){
        return;
    }
    exportKeyValue(exporter, key, value, defaultValue);
    exporter.newline();
}

export function exportKeyValue(exporter : Exporter, key: string, value : any, defaultValue? :any)
{
    if (value === defaultValue){
        return;
    }
    exporter.write(key).write('=');
    if (typeof value === 'string'){
        exporter.writeString(value);
    }
    else {
        exportSubobject(exporter, value);
    }
}
