import * as React from "react"
import { SectionTitle } from "../ui/SectionTitle";
import { create_controller } from "../controller/AppController";
import { Actor } from "../model/Actor";
import { UiText } from "../ui/UiText";
import { PolyFlags } from "../model/PolyFlags";
import { KnownClasses } from "../model/KnownClasses";
import { Vector } from "../model/Vector";
import { useSignal } from "./useSignal";
import { UiVectorInput } from "../ui/UiVectorInput";
import { edit_property_command as edit_property } from "../commands/edit_property";


export function PropertyEditor({ controller = create_controller() }) {

    const map = useSignal(controller.state_signal).map;
    let reuse_property_context = true;
    // get selection
    let selection = map.actors.filter(a => a.selected);
    const selection_ref = React.useRef<Actor[]>();
    if (is_same_selection(selection, selection_ref.current)){
        selection = selection_ref.current
    } else {
        selection_ref.current = selection
        reuse_property_context = false;
    }

    const controller_ref = React.useRef<ReturnType<typeof create_controller>>();
    if (controller_ref.current !== controller){
        controller_ref.current = controller
        reuse_property_context = false
    }

    const titleDetail = selection.length == 0
        ? '(no selection)'
        : selection.length > 1
            ? `(${selection.length} selected)`
            : null;

    return <div>
        <SectionTitle>Properties <span>{titleDetail}</span></SectionTitle>
        <div style={propertyEditorStyle}>
            <StringProp key="Name" selection={selection} name="Name" getter={a => a.name} />
            <StringProp key="Class" selection={selection} name="Class" getter={a => a.className} />
            <StringProp key="Model" selection={selection} name="Model" getter={a => a.brushModel?.name} />
            <PolyFlagsProp key="PolyFlags" selection={selection} name="PolyFlags" getter={a => a.polyFlags} />
            <VectorProp controller={controller} selection={selection} key="Location" name="Location" getter={a => a.location}/>
            <VectorProp controller={controller} selection={selection} key="OldLocation" name="OldLocation" getter={a => a.oldLocation}/>
            <VectorProp controller={controller} selection={selection} key="PrePivot" name="PrePivot" getter={a => a.prePivot}/>
        </div>
    </div>;
}

function is_same_selection(a : Actor[], b : Actor[]){
    if (b == null && a != null || b != null && a == null) return false
    if (a === b) return true
    if (a.length != b.length) return false
    for (let i=0; i<a.length; i++) if (a[i] !== b[i]) return false
    return true
}

const propertyEditorStyle = {
    display: 'grid',
    grid: "auto / 1fr 2fr"
}


function VectorProp({
    selection,
    controller,
    name,
    getter
}: { selection: Actor[], controller: ReturnType<typeof create_controller>, name: string, getter?: (a:Actor) => Vector }) {
    
    let aggregate : Vector;
    let aggregateCount = 0;
    for (const actor of selection){
        const value = getter ? getter(actor) : actor.get_vector_property(name);
        if (value === null || value === undefined){
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
            preview_value={value => { console.log('preview_value', value); controller.preview(edit_property, name, value)}}
            />
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