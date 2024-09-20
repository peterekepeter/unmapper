import { FunctionComponent } from "react"
import * as React from "react"

import { registerStyleClass } from "../theme"
import { UI_FONT_FAMILY } from "./typography"


const uiText = registerStyleClass('ui-text', () => ({ fontFamily: UI_FONT_FAMILY }))

export const UiText: FunctionComponent<{ children?: React.ReactNode }> = ({ children }) => 
    <span className={uiText}>{children}</span>
