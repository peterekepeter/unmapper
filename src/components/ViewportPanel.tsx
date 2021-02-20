import * as React from 'react';
import { Vector } from '../model/Vector';
import { Viewport } from './Viewport';
import { ViewportMode } from "../model/ViewportMode";
import { SectionTitle } from '../ui/SectionTitle';
import { create_controller } from '../controller/AppController';
import { UiButton } from '../ui/UiButton';
import { useSignal } from './useSignal';
import { set_viewport_mode_command } from '../commands/viewport/set_viewport_mode';

export function ViewportPanel({
    viewport_index = 0,
    controller = create_controller(),
    location = new Vector(0, 0, 0),
    mode = ViewportMode.Top }
) {

    const state = useSignal(controller.state_signal);
    let [viewportWidth, setViewportWidth] = React.useState(10);
    let [viewportHeight, setViewportHeight] = React.useState(10);

    function viewportContainer(p : HTMLDivElement){
        if (p != null){
            const width = Math.floor(p.clientWidth);
            const height = Math.floor(p.clientHeight);
            if (viewportWidth !== width){
                setViewportWidth(width);
            }
            if (viewportHeight !== height){
                setViewportHeight(height);
            }
        }
    }

    function set_mode(mode: ViewportMode){
        controller.execute(set_viewport_mode_command, viewport_index, mode)
    }

    return <div style={{
        display: 'grid',
        gridTemplate: 'auto 1fr / 1fr'
    }}>
        <SectionTitle>
            <div style={{ maxWidth:'100px', flexGrow:.2 }} >{generateTitle(state.viewports[viewport_index].mode)}</div>
            <UiButton onClick={()=> set_mode(ViewportMode.Top)}>Top</UiButton>
            <UiButton onClick={()=> set_mode(ViewportMode.Front)}>Front</UiButton>
            <UiButton onClick={()=> set_mode(ViewportMode.Side)}>Side</UiButton>
            <UiButton onClick={()=> set_mode(ViewportMode.Perspective)}>Perspective</UiButton>
        </SectionTitle>
        <div ref={viewportContainer} style={{
            display: 'grid',
            overflow: 'hidden',
            background: '#222',
            placeContent: 'center'
        }}>
            <Viewport 
                viewport_index={viewport_index}
                width={viewportWidth} height={viewportHeight}
                controller={controller}
                vertex_mode={state.vertex_mode}
                map={state.map}
                viewport_state={state.viewports[viewport_index]}></Viewport>
        </div>
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