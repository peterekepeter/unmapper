import * as React from "react"
import { font } from "./typography";

const uiSectionTitleStyle: React.CSSProperties = {
    ...font,
    margin: '.5em',
    display: 'flex',
    textTransform: 'uppercase',
    fontWeight: "normal",
    fontSize: '14px'
};

export function SectionTitle({ ...props }) {
    return <h3 style={uiSectionTitleStyle} {...props}></h3>;
}
