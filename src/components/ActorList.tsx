import React = require("react");
import { UnrealMap } from "../model/UnrealMap";
import { HoverEffect } from "../ui/HoverEffect";
import { UiActorClass } from "../ui/UiActorClass";
import { UiText } from "../ui/UiText";
import { SectionTitle } from "../ui/SectionTitle";

export function ActorList({ map = new UnrealMap() }) {

    return <div>
        <SectionTitle>Actor list</SectionTitle>
        {
        map.actors.map(actor => 
            <HoverEffect hoverStyle={{background: 'red', cursor: 'pointer'}}>
                <UiText>{actor.name}</UiText>
                <UiActorClass>{actor.className}</UiActorClass>
            </HoverEffect>
        )
    }</div>;
}
