import * as React from 'react'

import { use_signal } from '../components/useSignal'
import { themeColors } from '../theme'

const Decorator: React.FC = ({ children }) => (
    <ThemedDiv>
        {children}
    </ThemedDiv>
)

interface ThemedDivProps {
    padding?: number
}

const ThemedDiv: React.FC<ThemedDivProps> = props => {
    const colors = use_signal(themeColors)
    return <div style={{
        background: colors.background,
        color: colors.foreground,
        padding: '16px',
        width: '100%',
        height: '100%',
    }}>
        {props.children}
    </div>
}

export default Decorator
