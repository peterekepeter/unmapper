import React = require("react");
import { font } from "./typography";

export const uiActorClassStyle : React.CSSProperties = {
    ...font,
    color : '#ccc',
    marginLeft: '1em'
};

export function UiActorClass({ children = '' }) {
    return <span style={uiActorClassStyle}>{children}</span>;
}
