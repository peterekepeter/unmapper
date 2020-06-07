import React = require("react");
import { createController } from "../controller";
import { useSignal } from "./useSignal";
import { Viewport, ViewportMode } from "./Viewport";
import { ActorList } from "./ActorList";
import { PropertyEditor } from "./PropertyEditor";
import { Vector } from "../model/Vector";
import { ViewportPanel } from "./ViewportPanel";

export const Application = ({ controller = createController() }) => {

    const unrealMap = useSignal(controller.map);

    return <div style={{display:'grid', grid: 'auto auto / auto auto'}}>

        <ActorList map={unrealMap}/>
        <PropertyEditor/>
        <ViewportPanel 
            mode={ViewportMode.Top} 
            map={unrealMap}/>
        <ViewportPanel 
            mode={ViewportMode.Front} 
            map={unrealMap}/>
        <ViewportPanel 
            location={new Vector(0,0,-1024)}
            mode={ViewportMode.Perspective} 
            map={unrealMap}/>
        <ViewportPanel 
            mode={ViewportMode.Side} 
            map={unrealMap}/>
    </div>;

}
