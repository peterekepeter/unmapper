import { show_error_status_command } from "../commands/status/show_error_status_command"
import { AppController } from "./AppController"


export function install_error_handler(window: Window, constroller: AppController): void {

    window.onerror = function (msg: string|Event, url: string, line: number, col: number, error: Error) {
        let message = "Unknown error! Something went terribly wrong!"
        if (typeof msg === 'string'){
            message = msg
        }
        if (error && error.message) {
            message = error.message
        }
        constroller.execute(show_error_status_command, message)
    }

}