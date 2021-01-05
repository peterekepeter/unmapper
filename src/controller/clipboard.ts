// cliboard integration

import { createController } from ".";
import * as delete_selected_command from '../commands/delete_selected';

export function initializeClipboardIntegration(document: Document, controller = createController()){

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
          var data = e.clipboardData.getData('text/plain');
          controller.importFromString(data);
          e.preventDefault();
        }
    })

}