import * as React from "react"

export function HoverEffect(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    const { style, ...extra } = props
    const hover_style = React.useMemo(() => ({ ...style, ...HOVER_STYLE_CSS }), [props.style])
    const [is_hover, set_hover] = React.useState(false)
    return <div {...extra}
        onMouseEnter={() => set_hover(true)}
        onMouseLeave={() => set_hover(false)}
        style={is_hover ? hover_style : style} />
}

const HOVER_STYLE_CSS: React.CSSProperties = Object.freeze({
    opacity: .75,
    cursor: 'pointer'
})
