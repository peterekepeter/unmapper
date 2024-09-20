import * as React from "react"

import { registerStyleClass, StyleClassProperties } from "../theme"


export const uiButtonCssClass = registerStyleClass('ui-button', (): StyleClassProperties => ({ 
    background: '#333',
    color: '#aaa',
    border: '1px solid #333',
    borderTopColor: '#555',
    boxShadow: '0px 1px 1px #000',
    borderRadius: '2px',
    outline: 'none',
}))

const interactiveButton = registerStyleClass('interactive', (): StyleClassProperties => ({ 
    cursor: 'pointer',
    hover: { background: '#383838' },
    active: {
        background: '#333',
        boxShadow: 'inset 0px 1px 1px #000', 
        borderTopColor: '#333',
    },
}))

const disabledButton = registerStyleClass('disabled', (theme): StyleClassProperties => ({
    background: theme.background,
    textDecoration: 'line-through', 
}))

export interface UiButtonProps {
    children?: React.ReactNode
    disabled?: boolean
}

export const UiButton: React.FC<UiButtonProps> = ({ disabled, children }) => {
    const className = `${uiButtonCssClass} ${!disabled?interactiveButton:disabledButton}`
    return <button className={className}>{children}</button>
}
