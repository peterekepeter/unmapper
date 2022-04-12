import * as React from "react"

import { registerStyleClass, StyleClassProperties } from "../theme"
import { TextButton } from "./TextButton"


const menuPanel = registerStyleClass('menu-panel', (theme): StyleClassProperties => ({
    position: 'absolute',
    background: theme.background,
    zIndex: 1,
    boxShadow: '0px 2px 4px #0008, 0px 8px 32px #0008',
    borderRadius: '4px', 
}))

const iconPlaceholder = registerStyleClass('icon', (): StyleClassProperties => ({
    display: 'inline-block',
    width: '24px',
    height: '24px',
    position: 'absolute',
    left: '0',
}))

const expandPlaceholder = registerStyleClass('expand', (): StyleClassProperties => ({
    display: 'inline-block',
    width: '24px',
    height: '24px',
    position: 'absolute',
    right: '0',
}))

const itemRow = registerStyleClass('item', (): StyleClassProperties => ({ 
    display: 'flex',
    position: 'relative',
}))

const itemText = registerStyleClass('itemText', (): StyleClassProperties => ({ margin: '4px 28px' }))

const items = [
    'New',
    'Open',
    'Import',
    'Export',
    'Exit',
]

export function DropMenu(): JSX.Element {
    return <div className={menuPanel}>{
        items.map(item => 
            <TextButton key={item} className={itemRow}>
                <span className={iconPlaceholder}></span>
                <span className={itemText}>{item}</span>
                <span className={expandPlaceholder}></span>
            </TextButton>)
    }</div>
}
