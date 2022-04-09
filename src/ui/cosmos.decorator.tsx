import * as React from 'react'

import { themeColors, useStyleClasses as useRegisteredStyleClasses } from '../theme'
import { useSignal } from '../util'
import { useStyle } from '../util/useStyle'

const Decorator: React.FC = ({ children }) => {
    const colors = useSignal(themeColors)
    useStyle(`
        html {
            background: ${colors.background};
            color: ${colors.foreground};
        }
    `, [colors])
    useRegisteredStyleClasses()
    return <>
        {children}
    </>
}

export default Decorator
