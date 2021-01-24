import React = require("react");
import { SectionTitle } from "../ui/SectionTitle";
import { createController } from "../controller";
import { Actor } from "../model/Actor";
import { UiText } from "../ui/UiText";
import { PolyFlags } from "../model/PolyFlags";
import { KnownClasses } from "../model/KnownClasses";
import { Vector } from "../model/Vector";
import { useSignal } from "./useSignal";
import { UiVectorInput } from "../ui/UiVectorInput";
import * as edit_property from "../commands/edit_property";

export function PropertyEditor({ controller = createController() }) {

    const map = useSignal(controller.state_signal).map;
    
    const selection = map.actors.filter(a => a.selected);
    const titleDetail = selection.length == 0
        ? '(no selection)'
        : selection.length > 1
            ? `(${selection.length} selected)`
            : null;

    const prop = property_context(controller, selection);

    return <div>
        <SectionTitle>Properties <span>{titleDetail}</span></SectionTitle>
        <div style={propertyEditorStyle}>
            <StringProp selection={selection} name="Name" getter={a => a.name} />
            <StringProp selection={selection} name="Class" getter={a => a.className} />
            <StringProp selection={selection} name="Model" getter={a => a.brushModel?.name} />
            <PolyFlagsProp selection={selection} name="PolyFlags" getter={a => a.polyFlags} />
            <prop.Vector key="Location" name="Location" getter={a => a.location}/>
            <prop.Vector key="OldLocation" name="OldLocation" getter={a => a.oldLocation}/>
            <prop.Vector key="PrePivot" name="PrePivot"/>
        </div>
    </div>;
}

const propertyEditorStyle = {
    display: 'grid',
    grid: "auto / 1fr 2fr"
}

function property_context(controller: ReturnType<typeof createController>, selection: Actor[]){
    
    function Vector({
        name = '',
        getter = (a:Actor) => a.location
    }) {
        let aggregate : Vector;
        let aggregateCount = 0;
        for (const actor of selection){
            const value = getter ? getter(actor) : actor.get_property(name);
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
            <UiVectorInput value={aggregate} 
                next_value={value => { console.log('next_value', value); controller.execute(edit_property, name, value)}}
                // preview_value={value => { console.log('preview_value', value); controller.preview(edit_property, name, value)}}
                />
        </>
    }

    
    return {
        Vector
    }
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
        <UiVectorInput value={aggregate} next_value={value => console.log(value)}/>
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