import * as React from 'react'

import { set_viewport_mode_command } from '../commands/viewport/set_viewport_mode'
import { AppController, create_controller } from '../controller/AppController'
import { ALL_VIEWPORT_MODES, ViewportMode } from "../model/ViewportMode"
import { DropDown } from '../ui'
import { HoverEffect } from '../ui/HoverEffect'
import { UiText } from '../ui/UiText'
import { use_signal } from './useSignal'
import { Viewport } from './Viewport'

export function ViewportPanel(props: {
    viewport_index?: number,
    controller: AppController,
}) {
        
    const { viewport_index, controller } = props
        
    const state = use_signal(controller.state_signal)
    const [viewportWidth, setViewportWidth] = React.useState(10)
    const [viewportHeight, setViewportHeight] = React.useState(10)
    const [v_index, set_v_index] = React.useState<number>(viewport_index)
    React.useEffect(() => {
        if (v_index == null){
            const viewport = controller.allocate_viewport()
            set_v_index(viewport)
            return () => controller.free_viewport(viewport)
        } else {
            return () => { /*noop*/ }
        }
    })

    if (v_index == null){
        return <div style={{ background: '#222' }}></div>
    }

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
        controller.execute(set_viewport_mode_command, v_index, mode)
    }

    return <div style={{
        display: 'grid',
        position: 'relative',
        gridTemplate: '1fr / 1fr',
        width: '100%',
        height: '100%',
    }}>
        <div ref={viewportContainer} style={{
            display: 'grid',
            overflow: 'hidden',
            background: '#222',
            placeContent: 'center',
        }}>
            <Viewport
                viewport_index={v_index}
                width={viewportWidth} height={viewportHeight}
                controller={controller}
                state={state}></Viewport>
        </div>
        <div style={{ position: 'absolute' }}>
            <DropDown
                value={state.viewports[v_index].mode}
                options={ALL_VIEWPORT_MODES}
                onchange={mode => set_mode(mode)}></DropDown>
        </div>
    </div>
}
