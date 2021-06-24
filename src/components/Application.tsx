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
        const handler = (event: UIEvent) => {
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

    switch (state.options.editor_layout) {
        
        default: 
        case 0: return <PanelLayoutRoot 
            layout={state.options.layout}
            controller={controller}
            />
        case 1:return <div style={{
            display: 'grid',
            grid: '1fr 1fr / 0.5fr 1.5fr 1fr',
            overflow: 'hidden',
            width: '100%',
            height: '100%'
        }}>
            <ActorList controller={controller} />
            <ViewportPanel
                viewport_index={0}
                mode={ViewportMode.Top}
                controller={controller} />
            <ViewportPanel
                viewport_index={1}
                mode={ViewportMode.Front}
                controller={controller} />
            <PropertyEditor controller={controller} />
            <ViewportPanel
                viewport_index={2}
                location={new Vector(-500, -300, 300)}
                mode={ViewportMode.Perspective}
                controller={controller} />
            <ViewportPanel
                viewport_index={3}
                mode={ViewportMode.Side}
                controller={controller} />
        </div>

        case 2: return <div style={{
            display: 'grid',
            grid: '1fr 1fr / 1.5fr 1fr',
            overflow: 'hidden',
            width: '100%',
            height: '100%'
        }}>
            <ViewportPanel
                viewport_index={0}
                mode={ViewportMode.Top}
                controller={controller} />
            <ViewportPanel
                viewport_index={1}
                mode={ViewportMode.Front}
                controller={controller} />
            <ViewportPanel
                viewport_index={2}
                location={new Vector(-500, -300, 300)}
                mode={ViewportMode.Perspective}
                controller={controller} />
            <ViewportPanel
                viewport_index={3}
                mode={ViewportMode.Side}
                controller={controller} />
        </div>

        case 3: return <div style={{
            display: 'grid',
            grid: '1fr / 1fr',
            overflow: 'hidden',
            width: '100%',
            height: '100%'
        }}>
            <ViewportPanel
                viewport_index={0}
                mode={ViewportMode.Top}
                controller={controller} />
        </div>


        case 4: return <div style={{
            display: 'grid',
            grid: '1fr 1fr / 0.25fr 1fr',
            overflow: 'hidden',
            width: '100%',
            height: '100%'
        }}>
            <ActorList controller={controller} />
            <ViewportPanel
                viewport_index={0}
                mode={ViewportMode.Top}
                controller={controller} />
            <PropertyEditor controller={controller} />
            <ViewportPanel
                viewport_index={2}
                location={new Vector(-500, -300, 300)}
                mode={ViewportMode.Perspective}
                controller={controller} />
        </div>

        case 5: return <div style={{
            display: 'grid',
            grid: '1fr 1fr / 1fr',
            overflow: 'hidden',
            width: '100%',
            height: '100%'
        }}>
            <ViewportPanel
                viewport_index={0}
                mode={ViewportMode.Top}
                controller={controller} />
            <ViewportPanel
                viewport_index={2}
                location={new Vector(-500, -300, 300)}
                mode={ViewportMode.Perspective}
                controller={controller} />
        </div>
    }
}
