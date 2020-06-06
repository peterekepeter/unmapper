import React = require("react");
import { font } from "./typography";

const uiSectionTitleStyle: React.CSSProperties = {
    ...font,
    margin: '1em',
    textTransform: 'uppercase',
    fontWeight: "normal",
    fontSize: '14px'
};

export function SectionTitle({ ...props }) {
    return <h3 style={uiSectionTitleStyle} {...props}></h3>;
}
