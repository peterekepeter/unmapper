import { Exporter } from "./Exporter"
import { exportKeyValueNewline } from "./export-keyvalue"

export function export_reference_newline(exporter: Exporter, key: string, class_name: string, package_name: string, object_name: string): void {
    exportKeyValueNewline(exporter, key, `${class_name}'${package_name}.${object_name}'`)
}
