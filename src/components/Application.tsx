import React = require("react");
import { createController } from "../controller";
import { useSignal } from "./useSignal";
import { Viewport, ViewportMode } from "./Viewport";
import { ActorList } from "./ActorList";
import { PropertyEditor } from "./PropertyEditor";
import { Vector } from "../model/Vector";

export const Application = ({ controller = createController() }) => {

    const unrealMap = useSignal(controller.map);

    return <div>
        <ActorList map={unrealMap}/>
        <PropertyEditor/>
        <Viewport mode={ViewportMode.Top} map={unrealMap}/>
        <Viewport mode={ViewportMode.Front} map={unrealMap}/>
        <Viewport mode={ViewportMode.Side} map={unrealMap}/>
        <Viewport 
            location={new Vector(0,0,-2000)}
            mode={ViewportMode.Perspective} map={unrealMap}/>
    </div>;

}
