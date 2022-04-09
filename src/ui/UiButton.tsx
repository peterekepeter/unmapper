import * as React from "react"

import { registerStyleClass } from "../theme"

export const uiButtonCssClass = registerStyleClass('ui-button', theme => ({ 
    background: '#333',
    color: '#aaa',
    border: '1px solid #333',
    borderTopColor: '#555',
    boxShadow: '0px 1px 1px #000',
    borderRadius: '2px',
    outline: 'none',
    hover: { background: '#383838' },
}))

export const UiButton = ({ ...props }) => {
    return <button className={uiButtonCssClass} {...props}/>
}
