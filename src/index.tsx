import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";
import { createController } from "./controller";
import { dummyData2 } from "./dummyAppData";
import * as keyboard from './controller/keyboard';
import { ICommand } from "./controller/ICommand";
import { initializeClipboardIntegration } from "./controller/clipboard";
import * as select_all from './commands/select_all';

function main() {
    let controller = createController();
    keyboard.addEventListener(window);

    controller.commands.register_commands_v2([
        select_all
    ])
    
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
        description: "Delete Selection",
        implementation: controller.deleteSelected,
        shortcut: 'delete'
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
        description: "Toggle Vertex Mode",
        shortcut: "tab",
        implementation: controller.toggleVertexMode
    },
    {
        description: "Create polygon from selected vertexes",
        shortcut: "f",
        implementation: controller.createPolygonFromSelectedVertexes
    },
    {
        description: "Extrude selected polygons by 32 units",
        implementation: controller.extrudeSelectedPolygons,
        shortcut: 'e'
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
        'delete' : controller.deleteSelected,
        'f1' : controller.showAllCommands
    }

    initializeClipboardIntegration(window.document, controller);

    for (const key in shortcutBindings){
        keyboard.bind_command_shortcut({ 
            shortcut: key, 
            implementation: async (state) => { 
                await shortcutBindings[key]();
                return state;
            }
        });
    }

    keyboard.bind_command_executor(controller.execute);
    
    for (const command of controller.commands.get_all_commands_v2()){
        keyboard.bind_command_shortcut(command);
    }
    
    controller.loadFromString(dummyData2);
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