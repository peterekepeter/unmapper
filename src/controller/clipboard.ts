import { create_controller } from "./AppController";
import { delete_selected_command } from "../commands/delete_selected";
import { import_from_string_command } from "../commands/import_from_string";
import { EditorState } from "../model/EditorState";
import { store_map_to_string } from "../model/loader";
import { UnrealMap } from "../model/UnrealMap";

/** clipboard intergration */
export function install_clipboard_integration(document: Document, controller = create_controller()) : void {

    document.addEventListener('copy', function(event) {
        event.clipboardData.setData('text/plain', export_selection_to_string(controller.state_signal.value));
        event.preventDefault();
    });

    document.addEventListener('cut', function(event) {
        event.clipboardData.setData('text/plain', export_selection_to_string(controller.state_signal.value));
        controller.execute(delete_selected_command);
        event.preventDefault();
    });

    document.addEventListener('paste', function(e) {
        if (e.clipboardData.types.indexOf('text/plain') > -1) {
          const data = e.clipboardData.getData('text/plain');
          controller.execute(import_from_string_command, data);
          e.preventDefault();
        }
    })

    function export_selection_to_string(current_state: EditorState) : string {
        const actors = current_state.map.actors.filter(a => a.selected);
        const mapToExport = new UnrealMap();
        mapToExport.actors = actors;
        return store_map_to_string(mapToExport);
    }
}
