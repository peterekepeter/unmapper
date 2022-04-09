import { CSSProperties } from "react"

export interface StyleProperties {
    color?: string;
    background?: string;
    border?: string,
    borderTopColor?: string,
    boxShadow?: string,
    borderRadius?: string,
    outline?: string,
    cursor?: CSSProperties['cursor'],
    fontFamily?: CSSProperties['fontFamily'],
    textDecoration?: CSSProperties['textDecoration']
    userSelect?: CSSProperties['userSelect']
}
