import * as React from "react"
import { create_controller } from "../controller/AppController"
import { use_signal } from "./useSignal"
import { ViewportMode } from "../model/ViewportMode"
import { Vector } from "../model/Vector"
import { ViewportPanel } from "./ViewportPanel"
import { themeColors } from "../theme"
import { ActorList } from "./ActorList"
import { PropertyEditor } from "./PropertyEditor"
import { CommandPalette } from "./CommandPalette"
import { StatusBar } from "./StatusBar"
import { PanelLayoutRoot } from "./layout/PanelLayoutRoot"

export const Application = ({ controller = create_controller() }) => {
    const colors = use_signal(themeColors)
    return <>
        <div style={{
            display: "grid",
            width: '100%',
            height: '100%',
            background: colors.background,
            color: colors.foreground,
            gridTemplate: "1fr 24px / 1fr"
        }}>
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

        };
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
