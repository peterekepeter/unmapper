import React = require("react");
import { createController } from "../controller";
import { useSignal } from "./useSignal";
import { ViewportMode } from "./Viewport";
import { ActorList } from "./ActorList";
import { PropertyEditor } from "./PropertyEditor";
import { Vector } from "../model/Vector";
import { ViewportPanel } from "./ViewportPanel";
import { themeColors } from "../theme";

export const Application = ({ controller = createController() }) => {

    const unrealMap = useSignal(controller.map);
    const colors = useSignal(themeColors);

    return <div style={{
        display:'grid', 
        grid: 'auto auto / auto auto', 
        background:colors.background, 
        color:colors.foreground,
        width:'100%',
        height:'100%'}}>

        <ActorList controller={controller}/>
        <PropertyEditor controller={controller}/>
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
