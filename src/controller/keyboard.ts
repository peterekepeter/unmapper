import { ICommand } from "./ICommand"

const bindings : { [key:string] : ICommand } = {};

export function bindShortcut(key: string, command : ICommand)
{
    bindings[key] = command;
}

const listener = (event : KeyboardEvent) => {
    const command = bindings[event.key];
    if (!command){
        return;
    }
    if (command.canExecute.value){
        command.execute();
    }
}


export function addEventListener(window : Window){
    window.addEventListener('keyup', listener);
}

export function removeEventListener(window : Window){
    window.removeEventListener('keyup', listener);
}
