import * as React from "react"

import { HoverEffect } from "./HoverEffect"
import { TextButton } from "./TextButton"
import { UiText } from "./UiText"

export function DropDown<T>(props: { value: T, options: T[], onchange: (new_value: T) => void }) : React.ReactElement {
    const { value, options, onchange } = props
    const [is_dropped, set_dropped] = React.useState(false)
    const div = React.useRef<HTMLDivElement>(null)
    return <div style={DROPDOWN_WRAPPER} ref={div} onBlur={onblur} tabIndex={0}>
        <DropownOptions<T>
            enabled={is_dropped}
            onselect={value => select(value)}
            value={value}
            options={options} />
        <div style={DROPDOWN_VALUE} onClick={drop}>
            <TextButton>
                {String(value)}
                {is_dropped ? '' : SVG_ARROW}
            </TextButton>

        </div>
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

function DropownOptions<T>(props: { enabled: boolean, options: T[], value: T, onselect: (new_value: T) => void }): JSX.Element {
    const { options, enabled, onselect: on_select, value } = props
    const sorted: T[] = use_sorted_options(options, value)
    if (!enabled) { return <></> }
    return <div style={{ position: 'relative' }}>
        <div style={OPTION_PANEL_STYLE}>
            {sorted.map(option => <HoverEffect
                key={`${option}`}
                onClick={() => on_select(option)}
                style={OPTION_ITEM_STYLE}>
                <UiText>{String(option)}</UiText>
            </HoverEffect>)}
        </div>
    </div>
}

const OPTION_PANEL_STYLE: React.CSSProperties = {
    position: 'absolute',
    background: '#444',
    zIndex: 1,
    boxShadow: '0px 2px 4px #0008, 0px 8px 32px #0008',
    borderRadius: '4px',
}

const OPTION_ITEM_STYLE: React.CSSProperties = { padding: '.25rem' }


function use_sorted_options<T>(opts: T[], value: T) {
    return React.useMemo(() => opts.slice().sort(compare), [opts, value])
    function compare(a: T, b: T) { return priority(b) - priority(a) }
    function priority(o: T): number { return o === value ? Infinity : 0 }
}
