import * as React from "react"
import { FunctionComponent } from "react"
import { font } from "../../ui/typography"

export const StatusBarItem: FunctionComponent<{ tip?: string }> = ({ children, tip }) =>
    <span style={{
        ...font,
        minWidth: '120px',
        textAlign: 'center',
        cursor: 'default'
    }} data-tip={tip}>
        {children}
    </span>
