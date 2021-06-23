import * as React from "react"
import { AppController } from "../controller/AppController"
import { PanelLayout, PanelSplitDirection, PanelType } from "../model/layout/PanelLayout"
import { ActorList } from "./ActorList"
import { PropertyEditor } from "./PropertyEditor"
import { ViewportPanel } from "./ViewportPanel"


export const PanelLayoutRenderer: React.FunctionComponent<{ 
        layout: PanelLayout, 
        controller: AppController}> = ({ layout, controller }) => {

    const div = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const [height, setHeight] = React.useState(0)

    React.useEffect(() => {
        if (width !== div.current.clientWidth){
            setWidth(div.current.clientWidth)
        }
        if (height !== div.current.clientHeight){
            setHeight(div.current.clientHeight)
        }
    })

    if (width !== 0 && height !== 0){
        return <div style={fillParentStyle} ref={div}>
            <PanelLayoutNode
                width={width}
                height={height}
                layout={layout} 
                controller={controller} />
        </div>
    } else {
        return <div style={fillParentStyle} ref={div}></div>
    }
}

const PanelLayoutNode: React.FunctionComponent<{
    layout:PanelLayout, 
    width: number,
    height: number,
    controller: AppController
}> = ({ width, height, layout, controller }) => {
    if (typeof layout === 'number'){
        return <PanelLayoutLeaf panelType={layout} controller={controller}/>
    }
    const size = calcSizeFromPanelLayout(width, height, layout)
    return <div style={styleFromPanelLayout(size, layout)}>
        <PanelLayoutNode 
            width={size.left_width}
            height={size.left_height}
            layout={layout.left_child} 
            controller={controller}/>
        <PanelLayoutNode 
            width={size.right_width}
            height={size.right_height}
            layout={layout.right_child} 
            controller={controller}/>
    </div>
}

const PanelLayoutLeaf: React.FunctionComponent<{
    panelType: PanelType,
    controller: AppController
}> = ({panelType, controller}) => {
    switch (panelType){
        case PanelType.Empty:
            <div>Empty</div>
            return 
        case PanelType.Objects:
            return <ActorList controller={controller}/>
        case PanelType.Properties:
            return <PropertyEditor controller={controller}/>
        case PanelType.Viewport:
            return <ViewportPanel controller={controller}/>
        default: 
            <div>NotImplemented</div>
            return
    }
}

type ChildLayoutSize = { 
    left_width: number, 
    left_height: number, 
    right_width: number, 
    right_height: number 
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
    let left_width, left_height;
    let right_width, right_height;
    if (direction === PanelSplitDirection.Horizontal){
        left_width = Math.round(split*width)
        right_width = width - left_width
        left_height = right_height = height
    } 
    else if (direction === PanelSplitDirection.Vertical){
        left_height = Math.round(split*height)
        right_height = height - left_height
        left_width = right_width = width
    }
    else throw new Error("not implemented")
    return { left_width, left_height, right_width, right_height }
}

function styleFromPanelLayout(
    size: ChildLayoutSize,
    layout: { 
        split_percentage: number; 
        split_direction: PanelSplitDirection; 
    }
): React.CSSProperties {
    const direction = layout.split_direction
    if (direction === PanelSplitDirection.Horizontal){
        return {
            display: 'grid',
            gridTemplate: `${size.left_height}px / ${size.left_width}px ${size.right_width}px`
        }
    } 
    else if (direction === PanelSplitDirection.Vertical){
        return {
            display: 'grid',
            gridTemplate: `${size.left_height}px ${size.right_height}px / ${size.left_width}px`
        }
    }
    else throw new Error("not implemented")
}


const fillParentStyle : React.CSSProperties = {
    width:'100%', 
    height:'100%', 
    maxWidth:'100%', 
    maxHeight:'100%',
    overflow: 'hidden'
}