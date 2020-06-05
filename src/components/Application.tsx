import React = require("react");
import { createController } from "../controller";
import { useSignal } from "./useSignal";
import { Viewport } from "./Viewport";
import { ActorList } from "./ActorList";

export const Application = ({ controller = createController() }) => {

    const unrealMap = useSignal(controller.map);

    return <div>
        <ActorList map={unrealMap}/>
        <Viewport map={unrealMap}/>
    </div>;

}
