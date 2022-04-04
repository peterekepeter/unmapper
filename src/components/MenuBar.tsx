import * as React from "react"

import { create_controller } from "../controller/AppController"
import { UiButton } from "../ui/UiButton"
import { UiText } from "../ui/UiText"


const MenuBarLayout: React.CSSProperties = { 
    display: 'grid', 
    gridAutoColumns: 'min-content', 
    gridTemplateRows: '24px', 
    gridAutoFlow: 'column', 
    columnGap: '16px',
    padding: '0px 16px',
}

export function MenuBar({ controller = create_controller() }) {
    return <div style={MenuBarLayout}>
        <Menu title="File">
            <Menu title="New"></Menu>
            <Menu title="Exit"></Menu>
        </Menu>
        <Menu title="Edit"></Menu>
        <Menu title="Help"></Menu>
    </div>
}


function Menu(props: React.PropsWithChildren<{ title: string }>){
    return <UiButton>{props.title}</UiButton>
}
