
import { ICommandInfoV2 } from "./command"

const bindings : { [key:string] : ICommandInfoV2 } = {}
let executor_fn : (cmd : ICommandInfoV2) => void

export function bind_command_shortcut(command: ICommandInfoV2): void{
    if (!command.shortcut){
        return
    }
    bindings[command.shortcut.toLowerCase()] = command
}

export function bind_command_executor(exec_fn : (cmd : ICommandInfoV2) => void): void
{
    executor_fn = exec_fn
}

const listener = (event : KeyboardEvent) => {
    if (event.target !== document.body){
        // ignore targeted input
        return
    }
    const shortcut = shortcutFromEvent(event)
    
    const command = bindings[shortcut]
    if (!command){
        // command not implemented
        return
    }
    executor_fn(command)
    event.preventDefault()
}

function shortcutFromEvent(event : KeyboardEvent){
    const result = []
    if (event.ctrlKey){
        result.push('ctrl')
    }
    if (event.altKey){ 
        result.push('alt')
    }
    if (event.shiftKey){ 
        result.push('shift')
    }
    result.push(event.key)
    return result.join(' + ').toLowerCase()
}


export function addEventListener(window : Window): void {
    window.addEventListener('keydown', listener)
}

export function removeEventListener(window : Window): void {
    window.removeEventListener('keydown', listener)
}
