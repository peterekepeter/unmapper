import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";
import { createController } from "./controller";
import { dummyData2 } from "./dummyAppData";
import * as keyboard from './controller/keyboard';
import { ICommand } from "./controller/ICommand";
import { install_clipboard_integration } from "./controller/clipboard";
import { get_all_commands_v2 } from "./commands/all_commands";
import { import_from_string_command } from "./commands/import_from_string";
function main() {
    let controller = createController();
    keyboard.addEventListener(window);

    controller.commands.register_commands_v2(get_all_commands_v2())
    
    controller.commands.registerCommands([{
        description: "Undo Previous Edit",
        implementation: controller.undo,
        shortcut: 'ctrl + z'
    },
    {
        description: "Redo Edit",
        implementation: controller.redo,
        shortcut: 'ctrl + y'
    },
    {
        description: "Align Mesh Vertexes to 32x32x32 Grid",
        implementation: () => controller.alignMeshVertexesToGrid(32),
    },
    {
        description: "Align Mesh Vertexes to 16x16x16 Grid",
        implementation: () => controller.alignMeshVertexesToGrid(16),
    },
    {
        description: "Align Mesh Vertexes to 8x8x8 Grid",
        implementation: () => controller.alignMeshVertexesToGrid(8),
    },
    {
        description: "Shuffle Mesh Polygons",
        implementation: controller.shuffleMeshPolygons,
    },
    {
        description: "Triangulate Mesh Polygons",
        implementation: controller.triangulateMeshPolygons,
    },
    {
        description: "Undo Copy Move",
        implementation: controller.undoCopyMove
    },
    {
        description: "Flip polygon (normal, winding, facing)",
        implementation: controller.flipPolygonNormal
    },
    {
       description: 'UV: triplanar map brush polygons',
       implementation: controller.uv_triplanar_map_selected
    }])

    const shortcutBindings : { [key:string] : ICommand } = {
        'ctrl + z' : controller.undo,
        'ctrl + y' : controller.redo,
        'ctrl + shift + z' : controller.redo,
        'ctrl + shift + y' : controller.undo,
        'f1' : controller.showAllCommands
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