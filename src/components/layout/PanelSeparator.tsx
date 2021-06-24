import * as React from "react"
import { set_layout_split_percentage_command as cmd } from "../../commands/layout/set_layout_split_percentage"
import { AppController } from "../../controller/AppController"
import { PanelSplitDirection } from "../../model/layout/PanelLayout"
import { themeColors } from "../../theme"
import { use_signal } from "../useSignal"
import { ChildLayoutSize } from "./ChildLayoutSize"

export const PanelSeparator: React.FunctionComponent<{
    layout: {
        split_percentage: number;
        split_direction: PanelSplitDirection;
    },
    controller: AppController,
    size: ChildLayoutSize,
    layoutPath: string
}> = ({controller, layout, size, layoutPath}) => {
    const [hover, set_hover] = React.useState(false)
    const pointer = React.useRef({ 
        is_moving: false, 
        start_x: 0, 
        start_y: 0,
        start_left_width: 0,
        start_left_height: 0,
        new_percentage: NaN
    })

    const div = React.useRef<HTMLDivElement>()
    const colors = use_signal(themeColors)
    const style: React.CSSProperties = {
        position: 'absolute'
    }

    const inner_style: React.CSSProperties = {
        background: hover ? colors.accent : 'none',
        transition: 'background 100ms linear',
        transitionDelay: '250ms',
    }

    if (layout.split_direction === PanelSplitDirection.Horizontal){
        style.cursor = 'ew-resize'
        style.left = size.left_width-4
        style.width = '2px'
        style.height = size.left_height
        style.padding = '0px 3px'
        inner_style.width = '2px'
        inner_style.height = size.left_height
    } else {
        style.cursor = 'ns-resize'
        style.top = size.left_height-4
        style.width = size.left_width
        style.height = '2px'
        style.padding = '3px 0px'
        inner_style.width = size.left_width
        inner_style.height = '2px'
    }

    return <div ref={div} style={style}
        onMouseEnter={() => set_hover(true)}
        onMouseLeave={() => set_hover(false)}
        onPointerDown={handle_pointer_down}
        onPointerUp={handle_pointer_up}
        onPointerMove={handle_pointer_move}>
        <div style={inner_style}></div>
    </div>

    function handle_pointer_down(event: React.PointerEvent<HTMLDivElement>){
        div.current.setPointerCapture(event.pointerId)
        pointer.current.is_moving = true
        pointer.current.start_x = event.clientX
        pointer.current.start_y = event.clientY
        pointer.current.start_left_width = size.left_width
        pointer.current.start_left_height = size.left_height
    }

    function handle_pointer_up(event: React.PointerEvent<HTMLDivElement>){
        div.current.releasePointerCapture(event.pointerId)
        pointer.current.is_moving = false
        const percentage = pointer.current.new_percentage
        if (!isNaN(percentage)){
            controller.execute(cmd, layoutPath, percentage)
        }
    }

    function handle_pointer_move(event: React.PointerEvent<HTMLDivElement>){
        if (!pointer.current.is_moving) {
            return
        }
        if (layout.split_direction === PanelSplitDirection.Horizontal){
            const delta_x = event.clientX - pointer.current.start_x
            pointer.current.new_percentage = 
                (pointer.current.start_left_width + delta_x) / 
                (size.left_width + size.right_width)
        } else {
            const delta_y = event.clientY - pointer.current.start_y
            pointer.current.new_percentage = 
                (pointer.current.start_left_height + delta_y) 
                / (size.left_height + size.right_height)
        }
        controller.preview(cmd, layoutPath, pointer.current.new_percentage)
    }
}
