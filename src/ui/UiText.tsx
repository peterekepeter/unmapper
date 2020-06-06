import React = require("react");
import { font } from "./typography";

const uiTextStyle : React.CSSProperties = {
    ...font
};

export function UiText({ children = '' }) {
    return <span style={uiTextStyle}>{children}</span>;
}
