import { createController } from ".";
import { delete_selected_command } from "../commands/delete_selected";

/** clipboard intergration */
export function install_clipboard_integration(document: Document, controller = createController()) : void {

    document.addEventListener('copy', function(event) {
        event.clipboardData.setData('text/plain', controller.exportSelectionToString());
        event.preventDefault();
    });

    document.addEventListener('cut', function(event) {
        event.clipboardData.setData('text/plain', controller.exportSelectionToString());
        controller.execute(delete_selected_command);
        event.preventDefault();
    });

    document.addEventListener('paste', function(e) {
        if (e.clipboardData.types.indexOf('text/plain') > -1) {
          const data = e.clipboardData.getData('text/plain');
          controller.importFromString(data);
          e.preventDefault();
        }
    })

}