import * as React from "react"
import { AppController } from "../../controller/AppController"
import { PanelLayout, PanelSplitDirection } from "../../model/layout/PanelLayout"
import { ChildLayoutSize } from "./ChildLayoutSize"
import { PanelLayoutLeaf } from "./PanelLayoutLeaf"
import { PanelSeparator } from "./PanelSeparator"


export const PanelLayoutNode: React.FunctionComponent<{
    layout:PanelLayout, 
    width: number,
    height: number,
    controller: AppController,
    layoutPath: string
}> = ({ width, height, layout, controller, layoutPath }) => {
    if (typeof layout === 'number'){
        return <PanelLayoutLeaf panelType={layout} controller={controller}/>
    }
    const size = calcSizeFromPanelLayout(width, height, layout)
    return <div style={styleFromPanelLayout(size, layout)}>
        <PanelLayoutNode 
            width={size.left_width}
            height={size.left_height}
            layout={layout.left_child} 
            layoutPath={layoutPath + "l"}
            controller={controller}/>
        <PanelLayoutNode 
            width={size.right_width}
            height={size.right_height}
            layout={layout.right_child} 
            layoutPath={layoutPath + "r"}
            controller={controller}/>
        <PanelSeparator 
            layout={layout} 
            size={size} 
            controller={controller} 
            layoutPath={layoutPath}/>
    </div>
}

function calcSizeFromPanelLayout(
    width: number,
    height: number,
    layout: {
        split_percentage: number;
        split_direction: PanelSplitDirection;
    }
): ChildLayoutSize {
    const direction = layout.split_direction
    const split = layout.split_percentage
    let left_width, left_height
    let right_width, right_height
    if (direction === PanelSplitDirection.Horizontal) {
        left_width = Math.round(split * width)
        right_width = width - left_width
        left_height = right_height = height
    }
    else if (direction === PanelSplitDirection.Vertical) {
        left_height = Math.round(split * height)
        right_height = height - left_height
        left_width = right_width = width
    }
    else
        throw new Error("not implemented")
    return { left_width, left_height, right_width, right_height }
}

export function styleFromPanelLayout(
    size: ChildLayoutSize,
    layout: {
        split_percentage: number;
        split_direction: PanelSplitDirection;
    }
): React.CSSProperties {
    const direction = layout.split_direction
    if (direction === PanelSplitDirection.Horizontal) {
        return {
            display: 'grid',
            position: 'relative',
            gridTemplate: `${size.left_height}px / ${size.left_width}px ${size.right_width}px`
        }
    }
    else if (direction === PanelSplitDirection.Vertical) {
        return {
            display: 'grid',
            position: 'relative',
            gridTemplate: `${size.left_height}px ${size.right_height}px / ${size.left_width}px`
        }
    }
    else
        throw new Error("not implemented")
}
