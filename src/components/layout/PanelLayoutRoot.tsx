import * as React from "react"
import { AppController } from "../../controller/AppController"
import { PanelLayout } from "../../model/layout/PanelLayout"
import { PanelLayoutNode } from "./PanelLayoutNode"

export const PanelLayoutRoot: React.FunctionComponent<{ 
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
            layoutPath=""
            width={width}
            height={height}
            layout={layout} 
            controller={controller} />
    </div>
} else {
    return <div style={fillParentStyle} ref={div}></div>
}
}

const fillParentStyle : React.CSSProperties = {
    width:'100%', 
    height:'100%', 
    maxWidth:'100%', 
    maxHeight:'100%',
    overflow: 'hidden'
}