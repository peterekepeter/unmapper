import React = require("react");
import { UnrealMap } from "../model/UnrealMap";
import { CSSProperties } from "styled-components";
import { HoverEffect } from "./HoverEffect";

const font : CSSProperties = {
    fontFamily : 'Segoe UI, sans-serif'
};

const uiTextStyle : CSSProperties = {
    ...font
};

function UiText({children=''}){
    return <span style={uiTextStyle}>{children}</span>
}

const uiActorClassStyle : CSSProperties = {
    ...font,
    color : '#ccc',
    marginLeft: '1em'
};

function UiActorClass({children=''}){
    return <span style={uiActorClassStyle}>{children}</span>
}

export function ActorList({ map = new UnrealMap() }) {

    return <div>{
        map.actors.map(actor => 
            <HoverEffect hoverStyle={{background: 'red', cursor: 'pointer'}}>
                <UiText>{actor.name}</UiText>
                <UiActorClass>{actor.className}</UiActorClass>
            </HoverEffect>
        )
    }</div>;
}
