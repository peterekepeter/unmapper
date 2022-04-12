import * as React from "react"

import { registerStyleClass, StyleClassProperties } from "../theme"
import { font } from "./typography"

const cssClass = registerStyleClass('text-button', (theme): StyleClassProperties => ({ 
    fontFamily: font.fontFamily,
    color: theme.foreground,
    borderRadius: '2px',
    outline: 'none',
    userSelect: 'none',
}))

const interactiveButton = registerStyleClass('interactive', (): StyleClassProperties => ({ 
    cursor: 'pointer',
    hover: { background: '#383838' },
    active: {
        background: '#333', 
        borderTopColor: '#333',
    },
}))

const disabledButton = registerStyleClass('disabled', (theme): StyleClassProperties => ({
    background: theme.background,
    textDecoration: 'line-through', 
    cursor: 'default',
}))

export interface TextButtonProps {
    disabled?: boolean
    className?: string
}

export const TextButton: React.FC<TextButtonProps> = ({ disabled, children, className }) => {
    const interactivity = !disabled?interactiveButton:disabledButton
    const compiledClassName = `${cssClass} ${interactivity} ${className??''}`
    return <span className={compiledClassName}>{children}</span>
}
