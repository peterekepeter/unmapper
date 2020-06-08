import React = require("react");
import { SectionTitle } from "../ui/SectionTitle";
import { createController } from "../controller";
import { Actor } from "../model/Actor";
import { UiText } from "../ui/UiText";

export function PropertyEditor({ controller = createController() }) {
    const selection = controller.map.value.actors.filter(a => a.selected);
    const titleDetail = selection.length == 0
        ? '(no selection)'
        : selection.length > 1
            ? `(${selection.length} selected actors)`
            : null;

    return <div>
        <SectionTitle>Properties <span>{titleDetail}</span></SectionTitle>
        <StringProp selection={selection} name="Name" getter={a => a.name} />
        <StringProp selection={selection} name="Class" getter={a => a.className} />
    </div>;
}


function StringProp({
    selection = new Array<Actor>(),
    name = '',
    getter = (a: Actor) => a.name
}) {
    let aggregate: string = null;
    let empty = true; 
    let different = false;
    for (const actor of selection) {
        const value = getter(actor);
        if (empty) {
            aggregate = value;
            empty = false;
        }
        else if (!different && value !== aggregate)
        {
            aggregate = '... different values';
            different = true;
        }
    }
    return <div>
        <UiText>{name}</UiText>
        <UiText>{aggregate}</UiText>
    </div>
}