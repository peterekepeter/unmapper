import * as React from 'react';
import { Vector } from '../model/Vector';
import { Viewport } from './Viewport';
import { ViewportMode, ALL_VIEWPORT_MODES } from "../model/ViewportMode";
import { SectionTitle } from '../ui/SectionTitle';
import { create_controller } from '../controller/AppController';
import { UiButton } from '../ui/UiButton';
import { useSignal } from './useSignal';
import { set_viewport_mode_command } from '../commands/viewport/set_viewport_mode';
import { UiText } from '../ui/UiText';
import { HoverEffect } from '../ui/HoverEffect';

export function ViewportPanel({
    viewport_index = 0,
    controller = create_controller(),
    location = new Vector(0, 0, 0),
    mode = ViewportMode.Top }
) {

    const state = useSignal(controller.state_signal)
    const [viewportWidth, setViewportWidth] = React.useState(10)
    const [viewportHeight, setViewportHeight] = React.useState(10)

    function viewportContainer(p: HTMLDivElement) {
        if (p != null) {
            const width = Math.floor(p.clientWidth)
            const height = Math.floor(p.clientHeight)
            if (viewportWidth !== width) {
                setViewportWidth(width)
            }
            if (viewportHeight !== height) {
                setViewportHeight(height)
            }
        }
    }

    function set_mode(mode: ViewportMode) {
        controller.execute(set_viewport_mode_command, viewport_index, mode)
    }

    return <div style={{
        display: 'grid',
        position: 'relative',
        gridTemplate: '1fr / 1fr'
    }}>
        <div ref={viewportContainer} style={{
            display: 'grid',
            overflow: 'hidden',
            background: '#222',
            placeContent: 'center',
        }}>
            <Viewport
                viewport_index={viewport_index}
                width={viewportWidth} height={viewportHeight}
                controller={controller}
                state={state}></Viewport>
        </div>
        <div style={{ position: 'absolute' }}>
            <DropDown
                value={state.viewports[viewport_index].mode}
                options={ALL_VIEWPORT_MODES}
                on_change={mode => set_mode(mode)}></DropDown>
            {/* <UiText>{generateTitle(state.viewports[viewport_index].mode)}</UiText>
            <UiButton onClick={()=> set_mode(ViewportMode.Top)}>Top</UiButton>
            <UiButton onClick={()=> set_mode(ViewportMode.Front)}>Front</UiButton>
            <UiButton onClick={()=> set_mode(ViewportMode.Side)}>Side</UiButton>
            <UiButton onClick={()=> set_mode(ViewportMode.Perspective)}>Perspective</UiButton> */}
        </div>
    </div>
}

function DropDown<T>(props: { value: T, options: T[], on_change: (new_value: T) => void }) {
    const {value, options, on_change} = props
    const [dropped, setDropped] = React.useState(false)
    return <div style={{
        margin: '.25rem'
    }}>
        {dropped ? <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                background: '#444',
                zIndex: 1,
                boxShadow: '0px 2px 4px #0008, 0px 8px 32px #0008',
                borderRadius: '2px',
            }}>
                {options.map((option,i) => <HoverEffect
                    key={`${option}-${i}`}
                    onClick={() => select(option)}
                    defaultStyle={{ padding: '.25rem' }}
                    hoverStyle={{ padding: '.25rem', opacity: 0.75, cursor: 'pointer' }}>
                    <UiText>{option}</UiText>
                </HoverEffect>)}
            </div>
        </div> : <></>}
        <HoverEffect
            defaultStyle={{ display: 'flex', flexFlow: 'row', alignItems: 'center', padding: '.25rem' }}
            hoverStyle={{ display: 'flex', flexFlow: 'row', alignItems: 'center', padding: '.25rem', opacity: 0.75, cursor: 'pointer' }}
            onClick={drop}>
            <UiText>{value}</UiText>
            <svg style={{ height: '6px', marginLeft: '.25rem', fill: '#ccc' }}><path d="M0,0 L4,6 L8,0 Z" /></svg>
        </HoverEffect>
    </div>
    function drop() {
        setDropped(true)
    }
    function select(option: T) {
        setDropped(false)
        on_change(option)
    }
}