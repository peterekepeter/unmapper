import { FunctionComponent } from "react";
import React = require("react");
import { font } from "./typography";

const uiTextStyle : React.CSSProperties = {
    ...font
};

export const UiText: FunctionComponent = ({ children }) => 
    <span style={uiTextStyle}>{children}</span>;
