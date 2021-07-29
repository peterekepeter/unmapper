import { Exporter } from "./Exporter"
import { BrushModel } from "../../BrushModel"
import { BrushPolygonData } from "../../BrushPolygonData"
import { exportVector } from "./export-vector"
import { Vector } from "../../Vector"
import { brushToPolygonData } from "../../brush-convert"
import { export_reference_newline } from "./export_reference"
import { KnownClasses } from "../../KnownClasses"
import { KnownPackages } from "../../KnownPackages"


export function exportBrushModel(exporter: Exporter, brush: BrushModel){
    if (brush == null){
        return
    }
    const name = brush.name || "Model0"
    exporter.write("Begin Brush Name=").writeString(name).newline().increaseIndent()
    exportPolyList(exporter, brushToPolygonData(brush))
    exporter.decraseIndent().write("End Brush").newline()
    export_reference_newline(exporter, "Brush", KnownClasses.Model, KnownPackages.MyLevel, name)
}

function exportPolyList(exporter: Exporter, polygons: BrushPolygonData[]){
    exporter.write("Begin PolyList").increaseIndent().newline()
    for (const polygon of polygons){
        exportPolygon(exporter, polygon)
    }
    exporter.decraseIndent().write("End PolyList").newline()
}

function exportPolygon(exporter: Exporter, polygon: BrushPolygonData){
    exporter.write("Begin Polygon")
    if (polygon.item != null && polygon.item.length > 0){
        exporter.write(" Item=").writeString(polygon.item)
    }
    if (polygon.flags != null && polygon.flags !== 0){
        exporter.write(" Flags=").writeInt(polygon.flags)
    }
    if (polygon.texture != null && polygon.texture.length > 0){
        exporter.write(" Texture=").writeString(polygon.texture)
    }
    if (polygon.link != null && polygon.link !== 0){
        exporter.write(" Link=").writeInt(polygon.link)
    }
    exporter.increaseIndent().newline()
    exportPolyData(exporter, polygon)
    exporter.decraseIndent().write("End Polygon").newline()
}

function exportPolyData(exporter: Exporter, polygon: BrushPolygonData){
    exportPolyVector(exporter, "Origin   ", polygon.origin)
    exportPolyVector(exporter, "Normal   ", polygon.normal)
    exportPolygonPan(exporter, "Pan      ", polygon.panU, polygon.panV)
    exportPolyVector(exporter, "TextureU ", polygon.textureU)
    exportPolyVector(exporter, "TextureV ", polygon.textureV)
    exportVertexData(exporter, "Vertex   ", polygon.vertexes)
}

function exportPolygonPan(exporter: Exporter, name: string, panU: number, panV: number){
    if (panU === 0 && panV === 0){
        return
    }
    exporter.write(name)
    if (panU !== 0){
        exporter.write("U=").writeInt(panU)
    }
    if (panV !== 0){
        exporter.write(panU !== 0 ? " V=" : "V=")
        exporter.writeInt(panV)
    }
    exporter.newline()
}

function exportVertexData(exporter: Exporter, name: string, vertexes: Vector[]){
    for (const vertex of vertexes){
        exportPolyVector(exporter, name, vertex)
    }
}

function exportPolyVector(exporter: Exporter, name: string, vector: Vector){
    exporter.write(name)
    exportVector(exporter, vector)
    exporter.newline()
}