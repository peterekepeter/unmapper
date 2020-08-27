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

    let [viewMode, setViewMode] = React.useState(mode);
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

    const buttonStyle = {
        border: '1px solid #333',
        borderTopColor: '#555',
        background: '#333',
        color: '#aaa',
        boxShadow: '0px 1px 1px #000',
        borderRadius: '2px'
    };

    return <div style={{
        display: 'grid',
        gridTemplate: 'auto 1fr / 1fr'
    }}>
        <SectionTitle>
            <div style={{ maxWidth:'100px', flexGrow:.2 }} >{generateTitle(viewMode)}</div>
            <button style={buttonStyle} onClick={()=> setViewMode(ViewportMode.Top)}>Top</button>
            <button style={buttonStyle} onClick={()=> setViewMode(ViewportMode.Front)}>Front</button>
            <button style={buttonStyle} onClick={()=> setViewMode(ViewportMode.Side)}>Side</button>
            <button style={buttonStyle} onClick={()=> setViewMode(ViewportMode.Perspective)}>Perspective</button>
        </SectionTitle>
        <div ref={viewportContainer} style={{
            display: 'grid',
            overflow: 'hidden',
            background: '#222',
            placeContent: 'center'
        }}>
            <Viewport 
                width={viewportWidth} height={viewportHeight}
                controller={controller} location={location} mode={viewMode}></Viewport>
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