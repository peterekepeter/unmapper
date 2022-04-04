import * as React from "react"

import { create_controller } from "../controller/AppController"
import { themeColors } from "../theme"
import { CommandPalette } from "./CommandPalette"
import { PanelLayoutRoot } from "./layout/PanelLayoutRoot"
import { MenuBar } from "./MenuBar"
import { StatusBar } from "./StatusBar"
import { use_signal } from "./useSignal"

const ENABLE_MENU_BAR = false

export const Application = ({ controller = create_controller() }) => {
    const colors = use_signal(themeColors)
    return <>
        <div style={{
            display: "grid",
            width: '100%',
            height: '100%',
            background: colors.background,
            color: colors.foreground,
            gridTemplate: ENABLE_MENU_BAR ? "24px 1fr 24px / 1fr" : "1fr 24px / 1fr",
        }}>
            {ENABLE_MENU_BAR ? <MenuBar controller={controller} /> : null}
            <MainGrid controller={controller} />
            <StatusBar controller={controller} />
        </div>
        <CommandPalette controller={controller} />
    </>
}

export const MainGrid = ({ controller = create_controller() }) => {

    const state = use_signal(controller.state_signal)
    const [resizeCount, setResizeCount] = React.useState(0)

    React.useEffect(() => {
        let timeout: any = null
        const handler = () => {
            if (timeout != null) {
                clearTimeout(timeout)
            }
            // force layout recalc with 100ms debounce
            timeout = setTimeout(() => setResizeCount(resizeCount + 1), 100)

        }
        window.addEventListener('resize', handler)
        return () => {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            window.removeEventListener('resize', handler)
        }
    })

    return <PanelLayoutRoot 
        layout={state.options.layout}
        controller={controller}
    />
}
