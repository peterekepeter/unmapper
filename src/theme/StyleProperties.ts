import { CSSProperties } from "react"

export interface StyleProperties {
    background?: string;
    border?: string,
    borderRadius?: string,
    borderTopColor?: string,
    bottom?: string;
    boxShadow?: string,
    color?: string;
    cursor?: CSSProperties['cursor'],
    display?: CSSProperties['display'],
    fontFamily?: CSSProperties['fontFamily'],
    height?: string;
    left?: string;
    margin?: string;
    outline?: string,
    padding?: string;
    position?: CSSProperties['position'],
    right?: string;
    textDecoration?: CSSProperties['textDecoration']
    top?: string;
    userSelect?: CSSProperties['userSelect']
    width?: string;
    zIndex?: number;
}
