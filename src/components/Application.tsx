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
        grid: '1fr 1fr / 1fr 1fr', 
        background:colors.background, 
        color:colors.foreground,
        width:'100%',
        height:'100%'}}>

        {/* <ActorList controller={controller}/>
        <PropertyEditor controller={controller}/> */}
        <ViewportPanel 
            mode={ViewportMode.Top} 
            controller={controller}/>
        <ViewportPanel 
            mode={ViewportMode.Front} 
            controller={controller}/>
        <ViewportPanel 
            location={new Vector(-500,-300,300)}
            mode={ViewportMode.Perspective} 
            controller={controller}/>
        <ViewportPanel 
            mode={ViewportMode.Side} 
            controller={controller}/>
    </div>;

}
