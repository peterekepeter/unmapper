import * as React from 'react';
import { UnrealMap } from '../model/UnrealMap';
import { Vector } from '../model/Vector';
import { ViewportMode, Viewport } from './Viewport';
import { SectionTitle } from '../ui/SectionTitle';

export function ViewportPanel({
    map = new UnrealMap(),
    location = new Vector(0, 0, 0),
    mode = ViewportMode.Top }
) {
    return <div>
        <SectionTitle>{generateTitle(mode)}</SectionTitle>
        <Viewport map={map} location={location} mode={mode}></Viewport>
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