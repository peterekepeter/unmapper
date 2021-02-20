import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";
import { dummyData2 } from "./dummyAppData";
import * as keyboard from './controller/keyboard';
import { ICommand } from "./controller/command/ICommand";
import { install_clipboard_integration } from "./controller/clipboard";
import { get_all_commands_v2 } from "./commands/all_commands";
import { import_from_string_command } from "./commands/import_from_string";
import { AppController } from "./controller/AppController";


function main() {

    const controller = new AppController();
    keyboard.addEventListener(window);

    controller.commands.register_commands_v2(get_all_commands_v2())
    
    controller.commands.register_commands_v1([{
        description: "Undo Previous Edit",
        implementation: controller.history.back,
        shortcut: 'ctrl + z'
    },
    {
        description: "Redo Edit",
        implementation: controller.history.forward,
        shortcut: 'ctrl + y'
    }]);

    const shortcutBindings : { [key:string] : ICommand } = {
        'ctrl + z' : controller.history.back,
        'ctrl + y' : controller.history.forward,
        'ctrl + shift + z' : controller.history.back,
        'ctrl + shift + y' : controller.history.forward,
        'f1' : controller.show_all_commands,
        'space' : controller.show_all_commands
    }

    install_clipboard_integration(window.document, controller);

    for (const key in shortcutBindings){
        keyboard.bind_command_shortcut({ 
            shortcut: key, 
            exec: (state) => { 
                shortcutBindings[key]();
                return state;
            }
        });
    }

    keyboard.bind_command_executor(controller.execute);
    
    for (const command of controller.commands.get_all_commands_v2()){
        keyboard.bind_command_shortcut(command);
    }
    
    controller.execute(import_from_string_command, dummyData2);
    setWindowTitle("Work in progress experimental stuff");
    initializeReact(document.body, controller);
}

function initializeReact(
    parentElement: HTMLElement,
    controller: AppController,
) {
    const mainElement = createMainElement();
    parentElement.appendChild(mainElement);
    applyFillParentStyleRecursively(mainElement);
    const application = <Application controller={controller} />;
    ReactDOM.render(application, mainElement);
}

function createMainElement() {
    const mainElement = document.createElement('main');
    applyFillParentStyle(mainElement);
    mainElement.id = 'unmapper-react-application';
    return mainElement;
}

function applyFillParentStyleRecursively(element: HTMLElement) {
    if (element != null) {
        applyFillParentStyle(element);
        applyFillParentStyleRecursively(element.parentElement)
    }
}

const fillParentStyle: Partial<CSSStyleDeclaration> = {
    width: "100%",
    height: "100%",
    margin: "0",
    padding: "0"
}

function applyFillParentStyle(element: HTMLElement) {
    for (const key in fillParentStyle) {
        element.style[key] = fillParentStyle[key];
    }
}

function setWindowTitle(str:string){
    document.querySelector('head>title').textContent = str;
}

main();