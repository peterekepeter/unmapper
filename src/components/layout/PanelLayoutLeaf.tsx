import * as React from "react"

import { AppController } from "../../controller/AppController"
import { PanelType } from "../../model/layout/PanelLayout"
import { ActorList } from "../ActorList"
import { PropertyEditor } from "../PropertyEditor"
import { ViewportPanel } from "../ViewportPanel"

export const PanelLayoutLeaf: React.FunctionComponent<{
    panelType: PanelType,
    controller: AppController
}> = ({ panelType, controller }) => {
    switch (panelType){
        case PanelType.Empty:
            return <div>Empty</div>
        case PanelType.Objects:
            return <ActorList controller={controller}/>
        case PanelType.Properties:
            return <PropertyEditor controller={controller}/>
        case PanelType.Viewport:
            return <ViewportPanel controller={controller}/>
        default: 
            return <div>NotImplemented</div>
    }
}
