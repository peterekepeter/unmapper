import React = require("react");
import { SectionTitle } from "../ui/SectionTitle";
import { createController } from "../controller";
import { Actor } from "../model/Actor";
import { UiText } from "../ui/UiText";
import { PolyFlags } from "../model/PolyFlags";

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
        <PolyFlagsProp selection={selection} name="PolyFlags" getter={a => a.polyFlags} />
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

function PolyFlagsProp({
    selection = new Array<Actor>(),
    name = '',
    getter = (a: Actor) => a.polyFlags
}) {
    
    let aggregate: PolyFlags = PolyFlags.None;
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
            different = true;
        }
    }
    let text = different ? '... different values'
        : polyFlagsToText(aggregate);
    return <div>
        <UiText>{name}</UiText>
        <UiText>{text}</UiText>
    </div>
}

function polyFlagsToText(flags : PolyFlags){
    const result = [];
    const value = flags;
    if (flags === PolyFlags.None){
        result.push('None');
    }
    if (flags & PolyFlags.SemiSolid){
        result.push('SemiSolid');
        flags -= PolyFlags.SemiSolid;
    }
    if (flags & PolyFlags.NonSolid){
        result.push('NonSolid');
        flags -= PolyFlags.NonSolid;
    }
    if (flags !== PolyFlags.None){
        result.push(PolyFlags)
    } 
    return `${result.join()} (${value})`;
}