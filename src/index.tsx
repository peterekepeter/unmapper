import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";
import { createController } from "./controller";
import { dummyData2 } from "./dummyAppData";
import * as keyboard from './controller/keyboard';
import { ICommand } from "./controller/ICommand";
import { registerCommands } from "./controller/commands";
import { initializeClipboardIntegration } from "./controller/clipboard";

function main() {
    let controller = createController();
    keyboard.addEventListener(window);
    
    registerCommands([{
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
        description: "Select All Objects",
        implementation: controller.selectAll,
        shortcut: 'ctrl + a'
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
        implementation: controller.toggleVertexMode
    },
    {
        description: "Create polygon from selected vertexes",
        implementation: controller.createPolygonFromSelectedVertexes
    },
    {
        description: "Extrude selected polygons by 32 units",
        implementation: controller.extrudeSelectedPolygons
    },
    {
        description: "Flip polygon (normal, winding, facing)",
        implementation: controller.flipPolygonNormal
    }])

    const shortcutBindings : { [key:string] : ICommand } = {
        'ctrl + z' : controller.undo,
        'ctrl + y' : controller.redo,
        'ctrl + shift + z' : controller.redo,
        'ctrl + shift + y' : controller.undo,
        'ctrl + a' : controller.selectAll,
        'delete' : controller.deleteSelected,
        'f1' : controller.showAllCommands
    }

    initializeClipboardIntegration(window.document, controller);
    
    for (const key in shortcutBindings){
        keyboard.bindShortcut(key, shortcutBindings[key]);
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