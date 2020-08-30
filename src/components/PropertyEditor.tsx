import React = require("react");
import { SectionTitle } from "../ui/SectionTitle";
import { createController } from "../controller";
import { Actor } from "../model/Actor";
import { UiText } from "../ui/UiText";
import { PolyFlags } from "../model/PolyFlags";
import { KnownClasses } from "../model/KnownClasses";
import { UiButton } from "../ui/UiButton";
import { Vector } from "../model/Vector";

export function PropertyEditor({ controller = createController() }) {
    const selection = controller.map.value.actors.filter(a => a.selected);
    const titleDetail = selection.length == 0
        ? '(no selection)'
        : selection.length > 1
            ? `(${selection.length} selected actors)`
            : null;

    return <div>
        <SectionTitle>Properties <span>{titleDetail}</span></SectionTitle>
        <div style={propertyEditorStyle}>
            <StringProp selection={selection} name="Name" getter={a => a.name} />
            <StringProp selection={selection} name="Class" getter={a => a.className} />
            <PolyFlagsProp selection={selection} name="PolyFlags" getter={a => a.polyFlags} />
            <VectorProp selection={selection} name="Location" getter={a => a.location}/>
            <VectorProp selection={selection} name="OldLocation" getter={a => a.oldLocation}/>
            <VectorProp selection={selection} name="PrePivot" getter={a => a.prePivot}/>
        </div>
    </div>;
}

const propertyEditorStyle = {
    display: 'grid',
    grid: "auto / 1fr 2fr"
}


function VectorProp({
    selection = new Array<Actor>(),
    name = '',
    getter = (a:Actor) => a.location
}) {
    let aggregate : Vector;
    let aggregateCount = 0;
    for (const actor of selection){
        const value = getter(actor);
        if (value === null){
            continue;
        }
        if (aggregateCount === 0){
            aggregate = value;
        } else {
            aggregate = aggregate.addVector(value);
        }
        aggregateCount ++;
    }
    if (!aggregate){
        return <></>
    }
    if (aggregateCount > 1){
        aggregate = aggregate.scale(1/aggregateCount);
    }
    const str = aggregateCount === 1 
        ? `${aggregate.x}x ${aggregate.y}y ${aggregate.z}z`
        : `${aggregate.x}x ${aggregate.y}y ${aggregate.z}z avg`
    return <>
        <UiText>{name}</UiText>
        <UiText>{str}</UiText>
    </>
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
    return <>
        <UiText>{name}</UiText>
        <UiText>{aggregate}</UiText>
    </>
}

function PolyFlagsProp({
    selection = new Array<Actor>(),
    name = '',
    getter = (a: Actor) => a.polyFlags
}) {

    let aggregate: PolyFlags = PolyFlags.None;
    let empty = true; 
    let different = false;
    let hasBrush = false;
    for (const actor of selection) {
        const value = getter(actor);
        if (actor.className === KnownClasses.Brush){
            hasBrush = true;
        }
        if (empty) {
            aggregate = value;
            empty = false;
        }
        else if (!different && value !== aggregate)
        {
            different = true;
        }
    }
    if (!hasBrush){
        return <></>; // this prop is N/A
    }
    let text = different ? '... different values'
        : polyFlagsToText(aggregate);
    return <>
        <UiText>{name}</UiText>
        <UiText>{text}</UiText>
    </>
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