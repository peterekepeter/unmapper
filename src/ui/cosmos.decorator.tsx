import * as React from 'react'

import { themeColors } from '../theme'
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
    return <>
        {children}
    </>
}

export default Decorator
