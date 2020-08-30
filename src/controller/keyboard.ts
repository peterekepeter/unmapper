import { ICommand } from "./ICommand"

const bindings : { [key:string] : ICommand } = {};

/** accepts shorctus like "ctrl + alt + shift + f" */
export function bindShortcut(shortcut: string, command : ICommand)
{
    bindings[shortcut.toLowerCase()] = command;
}

const listener = (event : KeyboardEvent) => {

    const shortcut = shortcutFromEvent(event);
    
    const command = bindings[shortcut];
    if (!command){
        return;
    }
    if (command.canExecute === undefined || command.canExecute.value){
        event.preventDefault();
        command();
        return false;
    }
}

function shortcutFromEvent(event : KeyboardEvent){
    let result = [];
    if (event.ctrlKey){ 
        result.push('ctrl');
    }
    if (event.altKey){ 
        result.push('alt');
    }
    if (event.shiftKey){ 
        result.push('shift');
    }
    result.push(event.key);
    return result.join(' + ').toLowerCase();
}


export function addEventListener(window : Window){
    window.addEventListener('keydown', listener);
}

export function removeEventListener(window : Window){
    window.removeEventListener('keydown', listener);
}
