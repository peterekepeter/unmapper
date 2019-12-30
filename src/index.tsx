import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";

ReactDOM.render(<Application/>, createRootElement());

function createRootElement(){
    const mainElement = document.createElement('main');
    mainElement.id = 'unmapper-react-application';
    document.body.appendChild(mainElement);
    return mainElement;
}
