import { UnrealMap } from "../model/UnrealMap"
import { Actor } from "../model/Actor"
import { Renderer } from "./IRenderer"
import { Vector } from "../model/Vector"
import { CsgOperation } from "../model/CsgOperation"
import { PolyFlags } from "../model/PolyFlags"
import { Color } from "../model/Color"
import { Rotation } from "../model/Rotation"
import { Matrix3x3 } from "../model/Matrix3x3"
import { BrushModel } from "../model/BrushModel"
import { EditorState } from "../model/EditorState"
import { BoundingBox } from "../model/BoundingBox"
import { GeometryCache } from "../model/geometry/GeometryCache"
import { intersect_segment_with_plane } from "../model/geometry/intersect-functions"
import { InteractionRenderState } from "../controller/interactions/InteractionRenderState"
import { ViewportMode } from "../model/ViewportMode"
import { get_brush_polygon_vertex_uvs } from "../model/uvmap/vertex_uv"
import { PerspectiveViewTransform } from "./transform/PerspectiveViewTransform"
import { ViewTransform } from "./ViewTransform"
import { TopViewTransform } from "./transform/TopViewTransform"
import { FrontViewTransform } from "./transform/FrontViewTransform"
import { SideViewTransform } from "./transform/SideViewTransform"
import { ViewportQueries } from "./ViewportQueries"

const backgroundColor = '#222'


interface IBrushColors {
    activeBrush: string
    addBrush: string
    semiSolidBrush: string
    nonSolidBrush: string
    subtractBrush: string
    invalidBrush: string
}

const colors: IBrushColors = {
    activeBrush: "#c12",
    addBrush: "#27c",
    semiSolidBrush: "#6aa",
    nonSolidBrush: "#191",
    subtractBrush: "#c62",
    invalidBrush: "#444",
}

const vertexColor = colors.activeBrush
const vertexSelectedColor = "#fff"
const uv_color = "#4c2"

const selectedColors: IBrushColors = {
    activeBrush: make_selected_color(colors.activeBrush),
    addBrush: make_selected_color(colors.addBrush),
    semiSolidBrush: make_selected_color(colors.semiSolidBrush),
    nonSolidBrush: make_selected_color(colors.nonSolidBrush),
    subtractBrush: make_selected_color(colors.subtractBrush),
    invalidBrush: make_selected_color(colors.invalidBrush),
}

function get_color_based_on_poly_count(count: number) {
    switch (count) {
        case 0: return "#666"
        case 1: return "#8c4"
        case 2: return "#c12"
        default: return "#c19"
    }
}

function make_selected_color(cstr: string) {
    const colorSelected = Color.WHITE
    return Color.fromHex(cstr).mix(colorSelected, 0.65).toHex()
}

function get_brush_wire_color(actor: Actor): string {
    const set: IBrushColors = actor.selected ? selectedColors : colors
    switch (actor.csgOperation) {
        case CsgOperation.Active: return set.activeBrush
        case CsgOperation.Add:
            if (actor.polyFlags & PolyFlags.NonSolid)
                return set.nonSolidBrush
            else if (actor.polyFlags & PolyFlags.SemiSolid)
                return set.semiSolidBrush
            else
                return set.addBrush
        case CsgOperation.Subtract: return set.subtractBrush
        default: return set.invalidBrush
    }
}

export function create_wireframe_renderer(canvas: HTMLCanvasElement, geometry_cache: GeometryCache): Renderer {
    const context = canvas.getContext("2d")
    let { width, height } = canvas
    let deviceSize = Math.min(width, height)
    let showVertexes = false
    let view_center: Vector = Vector.ZERO
    let render_transform: ViewTransform = null

    let view_rotation = Matrix3x3.IDENTITY
    let view_mode = ViewportMode.Top

    const viewport_queries = new ViewportQueries(geometry_cache)

    function render(state: EditorState): void {
        update_render_transform_props()
        render_map(state.map)
        render_interaction(state.interaction_render_state)
    }

    function render_map(map: UnrealMap) {

        update_render_transform_props()
        width = canvas.width
        height = canvas.height
        deviceSize = Math.min(width, height)

        context.fillStyle = backgroundColor
        context.fillRect(0, 0, width, height)

        if (map == null) {
            return
        }

        const view_bounding_box = render_transform.get_view_bounding_box()

        if (view_mode !== ViewportMode.UV) {
            for (let i = 0; i < map.actors.length; i++) {
                const actor = map.actors[i]
                if (!actor.selected) { render_actor(actor, i, view_bounding_box) }
            }
            if (showVertexes) {
                context.fillStyle = backgroundColor + '8'
                context.fillRect(0, 0, width, height)
            }
            for (let i = 0; i < map.actors.length; i++) {
                const actor = map.actors[i]
                if (actor.selected) { render_actor(actor, i, view_bounding_box) }
            }
        }
        else {
            context.strokeStyle = uv_color
            context.lineWidth = 1.5
            for (const actor of map.actors) {
                if (actor.selected && actor.brushModel) {
                    render_uv_lines(actor.brushModel)
                }
            }
            if (showVertexes) {
                context.fillStyle = uv_color
                for (const actor of map.actors) {
                    if (actor.selected && actor.brushModel) {
                        render_unselected_uv_points(actor.brushModel)
                    }
                }
                context.fillStyle = vertexSelectedColor
                for (const actor of map.actors) {
                    if (actor.selected && actor.brushModel) {
                        render_selected_uv_points(actor.brushModel)
                    }
                }
            }
        }
    }

    function update_render_transform_props() {
        render_transform.deviceSize = deviceSize
        render_transform.width = width
        render_transform.height = height
        render_transform.view_center = view_center
        render_transform.view_rotation = view_rotation
    }


    function render_actor(actor: Actor, index: number, view_bounding_box: BoundingBox) {
        if (actor.brushModel == null) {
            return
        }

        const box = geometry_cache.get_bounding_box(index)
        if (!view_bounding_box.intersects(box)) {
            return
        }

        const transformed_vertexes = geometry_cache.get_world_transformed_vertexes(index)

        context.strokeStyle = get_brush_wire_color(actor)
        context.lineWidth = 1.5

        render_wireframe_edges(actor.brushModel, transformed_vertexes, actor.selected && showVertexes)
        if (showVertexes && actor.selected) {
            render_vertexes(actor.brushModel, transformed_vertexes)
        }
    }

    function render_uv_lines(model: BrushModel) {

        for (let i = 0; i < model.polygons.length; i++) {
            const uvs = get_brush_polygon_vertex_uvs(model, i)
            let last = uvs[uvs.length - 1]
            for (const current of uvs) {

                const x0 = render_transform.view_transform_x(last)
                const y0 = render_transform.view_transform_y(last)
                const x1 = render_transform.view_transform_x(current)
                const y1 = render_transform.view_transform_y(current)
                const invalid0 = isNaN(x0) || isNaN(y0)
                const invalid1 = isNaN(x1) || isNaN(y1)


                if (!invalid0 && !invalid1) {
                    context.beginPath()
                    context.moveTo(x0, y0)
                    context.lineTo(x1, y1)
                    context.stroke()
                }

                last = current
            }
        }

    }

    function render_unselected_uv_points(model: BrushModel) {
        for (let i = 0; i < model.polygons.length; i++) {
            const poly = model.polygons[i]
            const uvs = get_brush_polygon_vertex_uvs(model, i)
            for (let j = 0; j < uvs.length; j++) {
                const current_uv = uvs[j]
                const current_vertex = model.vertexes[poly.vertexes[j]]

                if (current_vertex.selected) { continue }

                const x = render_transform.view_transform_x(current_uv)
                const y = render_transform.view_transform_y(current_uv)
                if (isNaN(x) || isNaN(y)) { continue }

                context.beginPath()
                context.arc(x, y, 3, 0, Math.PI * 2)
                context.fill()
            }
        }
    }

    function render_selected_uv_points(model: BrushModel) {
        for (let i = 0; i < model.polygons.length; i++) {
            const poly = model.polygons[i]
            const uvs = get_brush_polygon_vertex_uvs(model, i)
            for (let j = 0; j < uvs.length; j++) {
                const current_uv = uvs[j]
                const current_vertex = model.vertexes[poly.vertexes[j]]

                if (!current_vertex.selected) { continue }

                const x = render_transform.view_transform_x(current_uv)
                const y = render_transform.view_transform_y(current_uv)
                if (isNaN(x) || isNaN(y)) { continue }

                context.beginPath()
                context.arc(x, y, 3, 0, Math.PI * 2)
                context.fill()
            }
        }
    }

    function render_vertexes(brush: BrushModel, transformed_vertexes: Vector[]) {
        for (let i = 0; i < brush.vertexes.length; i++) {
            const is_selected = brush.vertexes[i].selected
            const point = transformed_vertexes[i]
            const x = render_transform.view_transform_x(point)
            const y = render_transform.view_transform_y(point)

            if (!isNaN(x) && !isNaN(y)) {
                context.fillStyle = is_selected ? vertexSelectedColor : vertexColor
                context.beginPath()
                context.arc(x, y, 3, 0, Math.PI * 2)
                context.fill()
            }
        }
    }

    function render_wireframe_edges(brush: BrushModel, transformed_vertexes: Vector[], colorBasedOnPolyCount: boolean) {
        let warned_brush_edges = false
        for (const edge of brush.edges) {
            const brushVertexA = brush.vertexes[edge.vertexIndexA]
            const brushVertexB = brush.vertexes[edge.vertexIndexB]
            if (!brushVertexA || !brushVertexB) {
                if (!warned_brush_edges) {
                    warned_brush_edges = true
                    console.warn('corrupted brush edges', brush)
                }
                continue
            }
            const vertexA = transformed_vertexes[edge.vertexIndexA]
            const vertexB = transformed_vertexes[edge.vertexIndexB]

            if (colorBasedOnPolyCount) {
                context.strokeStyle = get_color_based_on_poly_count(edge.polygons.length)
            }

            if (render_transform.can_3d_transform) {
                let out_vertex_a = render_transform.view_transform(vertexA)
                let out_vertex_b = render_transform.view_transform(vertexB)
                if (out_vertex_a.x < 0 && out_vertex_b.x < 0) {
                    continue
                }
                else if (out_vertex_a.x < 0) {
                    out_vertex_a = intersect_segment_with_plane(out_vertex_a, out_vertex_b, Vector.FORWARD, Vector.ZERO, +0.1)
                }
                else if (out_vertex_b.x < 0) {
                    out_vertex_b = intersect_segment_with_plane(out_vertex_b, out_vertex_a, Vector.FORWARD, Vector.ZERO, +0.1)
                }
                const screen_a_x = (out_vertex_a.y / out_vertex_a.x) * deviceSize + width * .5
                const screen_a_y = (-out_vertex_a.z / out_vertex_a.x) * deviceSize + height * .5
                const screen_b_x = (out_vertex_b.y / out_vertex_b.x) * deviceSize + width * .5
                const screen_b_y = (-out_vertex_b.z / out_vertex_b.x) * deviceSize + height * .5
                context.beginPath()
                context.moveTo(screen_a_x, screen_a_y)
                context.lineTo(screen_b_x, screen_b_y)
                context.stroke()
                continue;
            }

            const x0 = render_transform.view_transform_x(vertexA)
            const y0 = render_transform.view_transform_y(vertexA)
            const x1 = render_transform.view_transform_x(vertexB)
            const y1 = render_transform.view_transform_y(vertexB)
            const invalid0 = isNaN(x0) || isNaN(y0)
            const invalid1 = isNaN(x1) || isNaN(y1)


            if (!invalid0 && !invalid1) {
                context.beginPath()
                context.moveTo(x0, y0)
                context.lineTo(x1, y1)
                context.stroke()
            }
            else if (!invalid0 && invalid1 || invalid0 && !invalid1) {
                // need view transformed Z for clipping
                const v0 = invalid1 ? vertexA : vertexB
                const v1 = invalid1 ? vertexB : vertexA
                const vi = intersect_segment_with_plane(v0, v1, Vector.FORWARD, Vector.ZERO, -0.1)
                if (vi != null) {
                    const x0 = render_transform.view_transform_x(v0)
                    const y0 = render_transform.view_transform_y(v0)
                    const x1 = render_transform.view_transform_x(vi)
                    const y1 = render_transform.view_transform_y(vi)
                    context.beginPath()
                    context.moveTo(x0, y0)
                    context.lineTo(x1, y1)
                    context.stroke()
                }
            }
        }
    }

    function render_interaction(state: InteractionRenderState) {
        if (!state) {
            return
        }

        if (state.line_from && state.line_to) {
            const vertexA = state.line_from
            const vertexB = state.line_to

            const x0 = render_transform.view_transform_x(vertexA), y0 = render_transform.view_transform_y(vertexA)
            const x1 = render_transform.view_transform_x(vertexB), y1 = render_transform.view_transform_y(vertexB)
            const invalid0 = isNaN(x0) || isNaN(y0)
            const invalid1 = isNaN(x1) || isNaN(y1)

            if (!invalid0 && !invalid1) {
                context.strokeStyle = '#fff'
                const dx = x1 - x0, dy = y1 - y0
                const len = Math.sqrt(dx * dx + dy * dy)
                const nx = dx / len, ny = dy / len
                const rx = ny, ry = -nx
                context.beginPath()
                // line
                context.moveTo(x0, y0)
                context.lineTo(x1, y1)
                // tail
                context.moveTo(x0 - rx * 2, y0 - ry * 2)
                context.lineTo(x0 + rx * 2, y0 + ry * 2)
                // arrowhead
                context.moveTo(x1 + 6 * (-rx - nx), y1 + 6 * (-ry - ny))
                context.lineTo(x1, y1)
                context.lineTo(x1 + 6 * (+rx - nx), y1 + 6 * (+ry - ny))
                context.stroke()

            }
        }

        if (state.snap_location) {
            const x = render_transform.view_transform_x(state.snap_location)
            const y = render_transform.view_transform_y(state.snap_location)

            if (!isNaN(x) && !isNaN(y)) {
                context.strokeStyle = '#fff'
                context.beginPath()
                context.rect(x - 2, y - 2, 5, 5)
                context.stroke()

                if (state.line_to) {
                    const vertexB = state.line_to
                    const x1 = render_transform.view_transform_x(vertexB), y1 = render_transform.view_transform_y(vertexB)
                    if (!isNaN(x1) && !isNaN(y1)) {
                        context.setLineDash([3, 5])
                        context.beginPath()
                        context.moveTo(x, y)
                        context.lineTo(x1, y1)
                        context.stroke()
                        context.setLineDash([])
                    }
                }
            }

        }
    }

    set_top_mode(1 / 2400)

    function setCenterTo(location: Vector): void {
        view_center = location
    }

    function set_perspective_rotation(rotation: Rotation): void {
        view_rotation = Matrix3x3
            .rotateDegreesY(-rotation.pitch)
            .rotateDegreesZ(-rotation.yaw)
    }

    function set_perspective_mode(field_of_view: number): void {
        view_mode = ViewportMode.Perspective
        render_transform = new PerspectiveViewTransform(field_of_view)
        update_render_transform_props()
    }

    function set_top_mode(scale: number): void {
        view_mode = ViewportMode.Top
        render_transform = new TopViewTransform(scale)
        update_render_transform_props()
    }

    function set_uv_mode(scale: number): void {
        view_mode = ViewportMode.UV
        render_transform = new TopViewTransform(scale)
        update_render_transform_props()
    }

    function set_front_mode(scale: number): void {
        view_mode = ViewportMode.Front
        render_transform = new FrontViewTransform(scale)
        update_render_transform_props()
    }

    function set_side_mode(scale: number): void {
        view_mode = ViewportMode.Side
        render_transform = new SideViewTransform(scale)
        update_render_transform_props()
    }

    const s: Renderer = {
        render: render_map,
        render_v2: render,
        set_center_to: setCenterTo,
        set_front_mode,
        set_perspective_mode,
        set_side_mode,
        set_top_mode,
        set_uv_mode,
        get_view_mode: () => view_mode,
        set_perspective_rotation,
        find_nearest_actor: (map: UnrealMap, x: number, y: number) => { viewport_queries.render_transform = render_transform; return viewport_queries.find_nearest_Actor(map, x, y) },
        find_nearest_vertex: (map: UnrealMap, x: number, y:number) => { viewport_queries.render_transform = render_transform; return viewport_queries.find_nearest_vertex(map, x,y) },
        find_nearest_snapping_point: (map: UnrealMap, x: number, y: number, cgc: GeometryCache) => { viewport_queries.render_transform = render_transform; return viewport_queries.find_nearest_snapping_point(map, x, y, cgc) },
        get_pointer_world_location: (x, y) => render_transform.canvas_to_world_location(x, y),
        set_show_vertexes: (state: boolean) => { showVertexes = state }
    }
    return s
}
