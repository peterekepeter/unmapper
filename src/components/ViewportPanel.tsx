import * as React from 'react'

import { set_viewport_mode_command } from '../commands/viewport/set_viewport_mode'
import { AppController, create_controller } from '../controller/AppController'
import { ALL_VIEWPORT_MODES, ViewportMode } from "../model/ViewportMode"
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

function DropDown<T>(props: { value: T, options: T[], onchange: (new_value: T) => void }) {
    const { value, options, onchange } = props
    const [is_dropped, set_dropped] = React.useState(false)
    const div = React.useRef<HTMLDivElement>(null)
    return <div style={DROPDOWN_WRAPPER} ref={div} onBlur={onblur} tabIndex={0}>
        <DropdownOptions<T>
            enabled={is_dropped}
            onselect={value => select(value)}
            value={value}
            options={options} />
        <HoverEffect style={DROPDOWN_VALUE} onClick={drop}>
            <UiText>{value}</UiText>
            {SVG_ARROW}
        </HoverEffect>
    </div>
    function drop() {
        set_dropped(true)
    }
    function select(option: T) {
        div.current.focus()
        set_dropped(false)
        onchange(option)
    }
    function onblur(){
        set_dropped(false)
    }
}

const DROPDOWN_WRAPPER: React.CSSProperties = { margin: '.25rem' }

const DROPDOWN_VALUE: React.CSSProperties = {
    display: 'inline-flex',
    flexFlow: 'row',
    alignItems: 'center',
    padding: '.25rem',
}

const SVG_ARROW_STYLE: React.CSSProperties = {
    width: '8px',
    height: '6px',
    marginLeft: '.25rem',
    fill: '#ccc',
}

const SVG_ARROW: JSX.Element = <>
    <svg style={SVG_ARROW_STYLE}>
        <path d="M0,0 L4,6 L8,0 Z" />
    </svg>
</>

function DropdownOptions<T>(props: { enabled: boolean, options: T[], value: T, onselect: (new_value: T) => void }): JSX.Element {
    const { options, enabled, onselect: on_select, value } = props
    const sorted: T[] = use_sorted_options(options, value)
    if (!enabled) { return <></> }
    return <div style={{ position: 'relative' }}>
        <div style={OPTION_PANEL_STYLE}>
            {sorted.map(option => <HoverEffect
                key={`${option}`}
                onClick={() => on_select(option)}
                style={OPTION_ITEM_STYLE}>
                <UiText>{option}</UiText>
            </HoverEffect>)}
        </div>
    </div>
}

const OPTION_PANEL_STYLE: React.CSSProperties = {
    position: 'absolute',
    background: '#444',
    zIndex: 1,
    boxShadow: '0px 2px 4px #0008, 0px 8px 32px #0008',
    borderRadius: '2px',
}

const OPTION_ITEM_STYLE: React.CSSProperties = { padding: '.25rem' }


function use_sorted_options<T>(opts: T[], value: T) {
    return React.useMemo(() => opts.slice().sort(compare), [opts, value])
    function compare(a: T, b: T) { return priority(b) - priority(a) }
    function priority(o: T): number { return o === value ? Infinity : 0 }
}
