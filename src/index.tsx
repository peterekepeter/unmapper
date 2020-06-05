import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";
import { createController } from "./controller";
import { dummyAppData } from "./dummyAppData";

let controller = createController();
controller.loadFromString(dummyAppData);

ReactDOM.render(<Application controller={controller}/>, createRootElement());


function createRootElement(){
    const mainElement = document.createElement('main');
    mainElement.id = 'unmapper-react-application';
    document.body.appendChild(mainElement);
    return mainElement;
}
