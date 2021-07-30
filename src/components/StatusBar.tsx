import * as React from "react"
import { use_signal } from "./useSignal"
import { themeColors } from "../theme"
import { create_controller } from "../controller/AppController"
import { UvModeStatus } from "./status/UvModeStatus"
import { StatusBarItem } from "./status/StatusBarItem"
import { EditModeStatus } from "./status/EditModeStatus"
import { font } from "../ui/typography"

export function StatusBar({ controller = create_controller() }) {
    const [status_text, set_status_text] = React.useState('')
    const state = use_signal(controller.state_signal)
    const colors = use_signal(themeColors)
    React.useEffect(() => {
        const onenter = (event: MouseEvent) => {
            if (event.target instanceof HTMLElement) {
                const tip = event.target.dataset['tip']
                if (status_text != tip) {
                    set_status_text(tip)
                }
            }
        }
        window.document.body.addEventListener('mousemove', onenter)
        return () => window.removeEventListener('mousemove', onenter)
    })
    return <div style={{
        background: colors.background,
        color: colors.foreground,
        display: 'flex'
    }}>
        <div style={{ flexGrow: 1 }}></div>
        { state.status.is_error ? <div style={{ ...font, background: state.status.is_error ? colors.error : '', padding:'0rem 1rem' }}>ERROR</div> : null }
        <div style={{ flexGrow: 1 }}>
            <StatusBarItem>{state.status.message || status_text}</StatusBarItem>
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <UvModeStatus preserve_vertex={state.options.preserve_vertex_uv} />
        <EditModeStatus vertex_mode={state.options.vertex_mode}/>
    </div>
}


