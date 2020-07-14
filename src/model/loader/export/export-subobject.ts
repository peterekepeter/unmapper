import { Exporter } from "./Exporter";
import { exportKeyValue } from "./export-keyvalue";

export function exportSubobject(exporter : Exporter, obj : any)
{
    exporter.write("(");
    let separator = '';
    for (const  key in obj){
        const value = obj[key];
        exporter.write(separator);
        exportKeyValue(exporter, key, value);
        separator = ',';
    }
    exporter.write(")");
}
