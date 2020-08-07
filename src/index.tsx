import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";
import { createController } from "./controller";
import { dummyData2 } from "./dummyAppData";
import * as keyboard from './controller/keyboard';
import { createSignal } from "reactive-signals";
import { ICommand } from "./controller/ICommand";

function main() {
    let controller = createController();
    keyboard.addEventListener(window);
    keyboard.bindShortcut('Delete', { execute: controller.deleteSelected, canExecute: createSignal(true) })

    const shortcutBindings : { [key:string] : ICommand } = {
        'ctrl + z' : controller.undo,
        'ctrl + y' : controller.redo,
        'ctrl + shift + z' : controller.redo,
        'ctrl + shift + y' : controller.undo,
    }
    
    for (const key in shortcutBindings){
        keyboard.bindShortcut(key, shortcutBindings[key]);
    }

    controller.loadFromString(dummyData2);
    setWindowTitle("Unmapper");
    initializeReact(document.body, controller);
}

function initializeReact(
    parentElement: HTMLElement,
    controller = createController()
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