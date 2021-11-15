import { Actor } from "../../Actor"
import { BrushModel } from "../../BrushModel"
import { EditorState } from "../../EditorState"
import { get_actor_to_world_rotation_scaling, get_actor_to_world_transform } from "../../geometry/actor-space-transform"
import { get_vertex_uv } from "../../uvmap/vertex_uv"
import { Vector } from "../../Vector"

type WavefrontExportState = {
    vertex_count: number;
    vertex_texture_count: number;
    vertex_normal_count: number;
    out_lines: string[];
}

export function export_map_obj(state: EditorState, only_selected: boolean): string {
    const export_state: WavefrontExportState = {
        vertex_count: 0,
        vertex_normal_count: 0,
        vertex_texture_count: 0,
        // eslint-disable-next-line spellcheck/spell-checker
        out_lines: ["# unmapper OBJ export v1"],
    }
    generate_wavefront_obj_from_state(state, only_selected, export_state)
    return export_state.out_lines.join("\n")
}

function generate_wavefront_obj_from_state(state: EditorState, only_selected: boolean, export_state: WavefrontExportState) {
    let actors = state.map.actors
    if (only_selected){
        actors = state.selection.actors.map(s => actors[s.actor_index])
    }
    for (const actor of actors){
        generate_wavefront_from_actor(actor, export_state)
    }
}

function generate_wavefront_from_actor(actor: Actor, export_state: WavefrontExportState) {
    if (!actor.brushModel){
        export_state.out_lines.push(`# not supported ${actor.className} ${actor.name}`)
    } else {
        export_state.out_lines.push(`o ${actor.name}`)
        generate_wavefront_obj_from_brush(actor, actor.brushModel, export_state)
    }
}

function generate_wavefront_obj_from_brush(actor: Actor, brush: BrushModel, export_state: WavefrontExportState) {
    const actor_to_world = get_actor_to_world_transform(actor)
    const actor_to_world_scale_rotate = get_actor_to_world_rotation_scaling(actor)
    // generate vertexes in world space
    for (const vertex of brush.vertexes){
        const world_position: Vector = actor_to_world(vertex.position)
        export_state.out_lines.push(`v ${world_position.x} ${world_position.y} ${world_position.z}`)
    }
    // generate vertex texture coord for each vertex of each polygon
    for (const polygon of brush.polygons){
        for (const polygon_vertex_index of polygon.vertexes){
            const uv: Vector = get_vertex_uv(polygon, brush.vertexes[polygon_vertex_index].position)
            export_state.out_lines.push(`vt ${uv.x} ${uv.y}`)
        }
    }
    // generate 1 normal for each polygon
    for (const polygon of brush.polygons){
        const normal: Vector = actor_to_world_scale_rotate.apply(polygon.normal).normalize()
        export_state.out_lines.push(`vn ${normal.x} ${normal.y} ${normal.z}`)
    }
    // polygon assembly
    let total_polygon_vertex_counter = 0
    for (let polygon_index = 0; polygon_index < brush.polygons.length; polygon_index++){
        const polygon_string_builder = ["f"]
        for (const polygon_vertex_index of brush.polygons[polygon_index].vertexes){
            // vertex list same as we use internally
            const vertex_nr = polygon_vertex_index + 1 + export_state.vertex_count
            // generated 1 vertex texture for each vertex of each polygon
            const texture_nr = total_polygon_vertex_counter + 1 + export_state.vertex_texture_count
            // generate 1 normal for each polygon
            const normal_nr = polygon_index + 1 + export_state.vertex_normal_count
            polygon_string_builder.push(`${vertex_nr}/${texture_nr}/${normal_nr}`)
            total_polygon_vertex_counter++
        }
        export_state.out_lines.push(polygon_string_builder.join(" "))
    }
    export_state.vertex_count += brush.vertexes.length
    export_state.vertex_normal_count += brush.polygons.length
    export_state.vertex_texture_count += total_polygon_vertex_counter
}

