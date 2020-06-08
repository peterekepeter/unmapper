import * as React from 'react';
import { UnrealMap } from '../model/UnrealMap';
import { Vector } from '../model/Vector';
import { ViewportMode, Viewport } from './Viewport';
import { SectionTitle } from '../ui/SectionTitle';
import { createController } from '../controller';

export function ViewportPanel({
    controller = createController(),
    location = new Vector(0, 0, 0),
    mode = ViewportMode.Top }
) {

    let [viewportWidth, setViewportWidth] = React.useState(10);
    let [viewportHeight, setViewportHeight] = React.useState(10);

    function panelRef(p : HTMLDivElement){
        if (p!= null){
            if (viewportWidth === 10){
                setViewportWidth(p.clientWidth);
            }
            if (viewportHeight === 10){
                setViewportHeight(p.clientHeight);
            }
        }
    }
    console.log(viewportWidth, viewportHeight)

    return <div ref={panelRef}>
        <SectionTitle>{generateTitle(mode)}</SectionTitle>
        <Viewport 
            width={viewportWidth} height={viewportHeight}
            controller={controller} location={location} mode={mode}></Viewport>
    </div>
}

function generateTitle(mode : ViewportMode){
    switch(mode){
        case ViewportMode.Top: return 'Top';
        case ViewportMode.Front: return 'Front';
        case ViewportMode.Side: return 'Side';
        case ViewportMode.Perspective: return 'Perspective';
    }
}