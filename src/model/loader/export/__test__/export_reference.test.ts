import { Exporter } from "../Exporter"
import { export_reference_newline } from "../export_reference"


test('export reference to match pattern', () => 
    expect(exporting({ 
        key: 'Brush', 
        class_name:'Model', 
        package_name:'MyLevel', 
        object_name:'Model497' }))
    .toBe("Brush=Model'MyLevel.Model497'\n"))


function exporting(arg0: { key: string; class_name: string; package_name: string; object_name: string; }): string {
    const exporter = new Exporter()
    export_reference_newline(exporter, arg0.key, arg0.class_name, arg0.package_name, arg0.object_name)
    return exporter.toString()
}