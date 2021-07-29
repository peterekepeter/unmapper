import { Exporter } from "./Exporter"
import { Actor } from "../../Actor"
import { exportKeyValueNewline } from "./export-keyvalue"
import { exportNamedObjectVectorNewline } from "./export-vector"
import { csgOperationToString } from "../converter/convert-CsgOperation"
import { exportScaleNewline } from "./export-scale"
import { exportBrushModel } from "./export-brushmodel"
import { PolyFlags } from "../../PolyFlags"
import { exportRotationNewline } from "./export-rotation"


export function exportActor(exporter : Exporter, actor : Actor)
{
    exporter.write("Begin Actor")
    exporter.write(" Class=").writeString(actor.className)
    if (actor.name !== Actor.DEFAULT_ACTOR_NAME){
        exporter.write(" Name=").writeString(actor.name)
    }
    exporter.increaseIndent()
    exporter.newline()
    exportSupportedProps(exporter, actor)
    exportUnsupporterProps(exporter, actor.unsupportedProperties)
    exporter.decraseIndent()
    exporter.write("End Actor")
    exporter.newline()
}

function exportSupportedProps(exporter : Exporter, actor: Actor){
    exportGroupNewline(exporter, actor.group)
    exportNamedObjectVectorNewline(exporter, "Location", actor.location)
    exportNamedObjectVectorNewline(exporter, "OldLocation", actor.oldLocation)
    exportNamedObjectVectorNewline(exporter, "PrePivot", actor.prePivot)
    exportKeyValueNewline(exporter, "CsgOper", csgOperationToString(actor.csgOperation))
    exportKeyValueNewline(exporter, "PolyFlags", actor.polyFlags.toString(), "0")
    exportScaleNewline(exporter, "MainScale", actor.mainScale)
    exportScaleNewline(exporter, "PostScale", actor.postScale)
    exportScaleNewline(exporter, "TempScale", actor.tempScale)
    exportRotationNewline(exporter, "Rotation", actor.rotation)
    exportBrushModel(exporter, actor.brushModel)
}

function exportUnsupporterProps(exporter : Exporter, props : any)
{
    for (const key in props){
        const value = props[key]
        exportKeyValueNewline(exporter, key, value)
    }
}

function exportGroupNewline(exporter: Exporter, groups: string[]){
    if (groups == null || groups.length === 0){
        return
    }
    exporter.write("Group=")
    let separator = ''
    for (const group of groups){
        exporter.write(separator)
        exporter.writeString(group)
        separator = ','
    }
    exporter.newline()
}