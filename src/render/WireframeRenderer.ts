import { InteractionRenderState } from "../controller/interactions/InteractionRenderState"
import { Actor } from "../model/Actor"
import { BoundingBox } from "../model/BoundingBox"
import { BrushModel } from "../model/BrushModel"
import { Color } from "../model/Color"
import { CsgOperation } from "../model/CsgOperation"
import { ActorSelection } from "../model/EditorSelection"
import { EditorState } from "../model/EditorState"
import { GeometryCache } from "../model/geometry/GeometryCache"
import { intersect_segment_with_plane } from "../model/geometry/intersect_segment_with_plane"
import { PolyFlags } from "../model/PolyFlags"
import { get_brush_polygon_vertex_uvs } from "../model/uvmap/vertex_uv"
import { Vector } from "../model/Vector"
import { ViewportMode } from "../model/ViewportMode"
import { Renderer } from "./Renderer"
import { ViewTransform } from "./ViewTransform"

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
const uv_preserve_color = "#896"

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

function get_brush_wire_color(actor: Actor, is_selected: boolean): string {
    const set: IBrushColors = is_selected ? selectedColors : colors
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
    let device_size = Math.min(width, height)
    let render_transform: ViewTransform = null
    let viewport_index = -1

    function render(state: EditorState): void {
        render_map(state)
        render_interaction(state.interaction_render_state)
    }

    function render_map(state: EditorState) {
        const map = state.map
        width = canvas.width
        height = canvas.height
        device_size = Math.min(width, height)

        context.fillStyle = backgroundColor
        context.fillRect(0, 0, width, height)

        if (map == null) {
            return
        }

        const view_mode = state.viewports[viewport_index].mode

        if (view_mode === ViewportMode.UV){
            render_uv_viewport(state)
        } else {
            render_regular_viewport(state)
        }
    }

    function render_regular_viewport(state: EditorState){
        const view_bounding_box = render_transform.get_view_bounding_box()
        const map = state.map
        for (let i = 0; i < map.actors.length; i++) {
            const actor = map.actors[i]
            render_actor(state, actor, i, view_bounding_box)
        }
        if (state.options.vertex_mode) {
            context.fillStyle = backgroundColor + '8'
            context.fillRect(0, 0, width, height)
        }
        if (state.selection.actors){
            for (const selected_actor of state.selection.actors) {
                const actor = map.actors[selected_actor.actor_index]
                render_actor(state, actor, selected_actor.actor_index, view_bounding_box)
            }
        }
    }

    function render_actor(state: EditorState, actor: Actor, index: number, view_bounding_box: BoundingBox) {
        if (actor.brushModel == null) {
            return
        }

        const box = geometry_cache.get_bounding_box(index)
        if (!view_bounding_box.intersects(box)) {
            return
        }

        const actor_selection = state.selection.actors.find(s => s.actor_index === index)
        const transformed_vertexes = geometry_cache.get_world_transformed_vertexes(index)
        const is_selected = state.selection.actors && state.selection.actors.find(s => s.actor_index === index) != null

        context.strokeStyle = get_brush_wire_color(actor, is_selected)
        context.lineWidth = 1.5 * render_transform.device_pixel_ratio

        render_wire_edges(actor.brushModel, transformed_vertexes, is_selected && state.options.vertex_mode, actor_selection)

        if (state.options.vertex_mode && is_selected) {
            render_vertexes(actor.brushModel, transformed_vertexes, actor_selection)
            const world_polygon_centers = geometry_cache.get_world_transformed_polygon_centers(index)
            render_polygon_centers(actor.brushModel, transformed_vertexes, world_polygon_centers, actor_selection)
        }
    }

    function render_polygon_centers(brush: BrushModel, world_vertexes: Vector[], world_polygon_centers: Vector[], selection: ActorSelection){
        for (let i = 0; i < brush.polygons.length; i++) {
            const is_selected = selection.polygons && selection.polygons.indexOf(i) !== -1
            const point = world_polygon_centers[i]
            const x = render_transform.view_transform_x(point)
            const y = render_transform.view_transform_y(point)

            if (!isNaN(x) && !isNaN(y)) {
                context.fillStyle = is_selected ? vertexSelectedColor : vertexColor
                context.beginPath()
                const size_from_center = 2 * render_transform.device_pixel_ratio
                const size = size_from_center*2+1
                context.rect(x - size_from_center, y - size_from_center, size, size)
                context.fill()
            }
        }
    }

    function render_uv_viewport(state: EditorState) {
        context.strokeStyle = state.options.preserve_vertex_uv
            ? uv_preserve_color : uv_color
        context.lineWidth = 1.5 * render_transform.device_pixel_ratio
        
        for (const selection of state.selection.actors) {
            const actor = state.map.actors[selection.actor_index]
            if (actor.brushModel) {
                render_uv_edges(actor.brushModel)
            }
        }
        
        if (state.options.vertex_mode) {
            context.fillStyle = state.options.preserve_vertex_uv
                ? uv_preserve_color : uv_color
            for (const selection of state.selection.actors) {
                const actor = state.map.actors[selection.actor_index]
                if (actor.brushModel) {
                    render_not_selected_uv_points(actor.brushModel, selection)
                }
            }
            context.fillStyle = vertexSelectedColor
            context.strokeStyle = vertexSelectedColor
            for (const selection of state.selection.actors) {
                const actor = state.map.actors[selection.actor_index]
                if (actor.brushModel) {
                    render_selected_uv_points(actor.brushModel, selection)
                    render_selected_uv_edges(actor.brushModel, selection)
                }
            }
        }
    }

    function render_uv_edges(model: BrushModel) {

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

    function render_selected_uv_edges(model: BrushModel, selection: ActorSelection) {

        for (const selected_polygon of selection.polygon_vertexes) {
            const uv = get_brush_polygon_vertex_uvs(model, selected_polygon.polygon_index)

            for (const polygon_edge_index of selected_polygon.edges){
                const first_polygon_vertex = polygon_edge_index
                const second_polygon_vertex = first_polygon_vertex !== uv.length -1 ? first_polygon_vertex + 1 : 0
                const first = uv[first_polygon_vertex]
                const second = uv[second_polygon_vertex]
                const x0 = render_transform.view_transform_x(first)
                const y0 = render_transform.view_transform_y(first)
                const x1 = render_transform.view_transform_x(second)
                const y1 = render_transform.view_transform_y(second)
                const invalid0 = isNaN(x0) || isNaN(y0)
                const invalid1 = isNaN(x1) || isNaN(y1)

                if (!invalid0 && !invalid1) {
                    context.beginPath()
                    context.moveTo(x0, y0)
                    context.lineTo(x1, y1)
                    context.stroke()
                }
            }
        }

    }

    function render_not_selected_uv_points(model: BrushModel, selection: ActorSelection) {
        for (let i = 0; i < model.polygons.length; i++) {
            const uvs = get_brush_polygon_vertex_uvs(model, i)
            for (let j = 0; j < uvs.length; j++) {
                const current_uv = uvs[j]
                const selected_polygon = selection.polygon_vertexes.find(p => p.polygon_index === i)

                if (selected_polygon && selected_polygon.vertexes.indexOf(j) !== -1) { continue }

                const x = render_transform.view_transform_x(current_uv)
                const y = render_transform.view_transform_y(current_uv)
                if (isNaN(x) || isNaN(y)) { continue }

                context.beginPath()
                context.arc(x, y, 3 * render_transform.device_pixel_ratio, 0, Math.PI * 2)
                context.fill()
            }
        }
    }

    function render_selected_uv_points(model: BrushModel, selection: ActorSelection) {
        for (let i = 0; i < model.polygons.length; i++) {
            const uvs = get_brush_polygon_vertex_uvs(model, i)
            for (let j = 0; j < uvs.length; j++) {
                const current_uv = uvs[j]
                const selected_polygon = selection.polygon_vertexes.find(p => p.polygon_index === i)

                if (!selected_polygon || selected_polygon.vertexes.indexOf(j) === -1) { continue }

                const x = render_transform.view_transform_x(current_uv)
                const y = render_transform.view_transform_y(current_uv)
                if (isNaN(x) || isNaN(y)) { continue }

                context.beginPath()
                context.arc(x, y, 3 * render_transform.device_pixel_ratio, 0, Math.PI * 2)
                context.fill()
            }
        }
    }

    function render_vertexes(brush: BrushModel, transformed_vertexes: Vector[], selection: ActorSelection) {
        for (let i = 0; i < brush.vertexes.length; i++) {
            const is_selected = selection.vertexes && selection.vertexes.indexOf(i) !== -1
            const point = transformed_vertexes[i]
            const x = render_transform.view_transform_x(point)
            const y = render_transform.view_transform_y(point)

            if (!isNaN(x) && !isNaN(y)) {
                context.fillStyle = is_selected ? vertexSelectedColor : vertexColor
                context.beginPath()
                context.arc(x, y, 3 * render_transform.device_pixel_ratio, 0, Math.PI * 2)
                context.fill()
            }
        }
    }

    function render_wire_edges(
        brush: BrushModel, 
        transformed_vertexes: Vector[], 
        color_based_on_state: boolean, 
        actor_selection: ActorSelection,
    ) {
        if (color_based_on_state){
            
            for (let i = 0; i < brush.edges.length; i++) {
                const edge = brush.edges[i]
                if (actor_selection && actor_selection.edges.indexOf(i) !== -1){
                    continue
                } 
                context.strokeStyle = get_color_based_on_poly_count(edge.polygons.length)
                render_wire_edge(brush, i, transformed_vertexes)
            }

            if (actor_selection){
                context.strokeStyle = '#fff'
                for (const i of actor_selection.edges){
                    render_wire_edge(brush, i, transformed_vertexes)
                }
            }
        }
        else {
            for (let i = 0; i < brush.edges.length; i++) {
                render_wire_edge(brush, i, transformed_vertexes)
            }
        }
    }
    
    function render_wire_edge(
        brush: BrushModel, 
        edge_index: number, 
        transformed_vertexes: Vector[],
    ) : void {
        let warned_brush_edges = false
        const edge = brush.edges[edge_index]
        const brushVertexA = brush.vertexes[edge.vertexIndexA]
        const brushVertexB = brush.vertexes[edge.vertexIndexB]

        if (!brushVertexA || !brushVertexB) {
            if (!warned_brush_edges) {
                warned_brush_edges = true
                // eslint-disable-next-line no-console
                console.warn('corrupted brush edges', brush)
            }
            return
        }

        const vertexA = transformed_vertexes[edge.vertexIndexA]
        const vertexB = transformed_vertexes[edge.vertexIndexB]

        if (render_transform.can_3d_transform) {
            let out_vertex_a = render_transform.view_transform(vertexA)
            let out_vertex_b = render_transform.view_transform(vertexB)
            if (out_vertex_a.x < 0 && out_vertex_b.x < 0) {
                return
            }
            else if (out_vertex_a.x < 0) {
                out_vertex_a = intersect_segment_with_plane(out_vertex_a, out_vertex_b, Vector.FORWARD, Vector.ZERO, +0.1)
            }
            else if (out_vertex_b.x < 0) {
                out_vertex_b = intersect_segment_with_plane(out_vertex_b, out_vertex_a, Vector.FORWARD, Vector.ZERO, +0.1)
            }
            const screen_a_x = (out_vertex_a.y / out_vertex_a.x) * device_size + width * .5
            const screen_a_y = (-out_vertex_a.z / out_vertex_a.x) * device_size + height * .5
            const screen_b_x = (out_vertex_b.y / out_vertex_b.x) * device_size + width * .5
            const screen_b_y = (-out_vertex_b.z / out_vertex_b.x) * device_size + height * .5
            context.beginPath()
            context.moveTo(screen_a_x, screen_a_y)
            context.lineTo(screen_b_x, screen_b_y)
            context.stroke()
            return
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
    function render_interaction(state: InteractionRenderState) {
        if (!state) {
            return
        }

        if (state.viewport_box_index != null && state.viewport_box_index === viewport_index) {
            if (state.viewport_box) {
                context.strokeStyle = '#fff'
                context.beginPath()
                const { min_x, min_y, max_x, max_y } = state.viewport_box
                context.moveTo(min_x, min_y)
                context.lineTo(max_x, min_y)
                context.lineTo(max_x, max_y)
                context.lineTo(min_x, max_y)
                context.closePath()
                context.stroke()
            }
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
                const size_from_center = 2 * render_transform.device_pixel_ratio
                const size = size_from_center*2+1
                context.rect(x - size_from_center, y - size_from_center, size, size)
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

        if (state.shapes){
            context.strokeStyle = '#fff'
            context.fillStyle = '#fff'
            for (const shape of state.shapes){
                if (shape.type === 'Point') {
                    const x = render_transform.view_transform_x(shape.location)
                    const y = render_transform.view_transform_y(shape.location)
                    
                    if (!isNaN(x) && !isNaN(y)) {
                        switch (shape.shape){
                            case "Dot":
                                context.beginPath()
                                context.arc(x, y, 3 * render_transform.device_pixel_ratio, 0, Math.PI * 2)
                                context.fill()
                                break
                            case "SmallDot":
                                context.beginPath()
                                context.arc(x, y, 2 * render_transform.device_pixel_ratio, 0, Math.PI * 2)
                                context.fill()
                                break
                            case "TinyDot":
                                context.beginPath()
                                context.arc(x, y, 1 * render_transform.device_pixel_ratio, 0, Math.PI * 2)
                                context.fill()
                                break
                            case "X": {
                                context.beginPath()
                                const size_from_center = 2 * render_transform.device_pixel_ratio
                                const size = size_from_center*2+1
                                context.moveTo(x - size, y - size)
                                context.lineTo(x + size, y + size)
                                context.moveTo(x + size, y - size)
                                context.lineTo(x - size, y + size)
                                context.stroke()
                                break
                            }
                            default:
                            case "Rectangle": {
                                context.beginPath()
                                const size_from_center = 2 * render_transform.device_pixel_ratio
                                const size = size_from_center*2+1
                                context.rect(x - size_from_center, y - size_from_center, size, size)
                                context.stroke()
                                break
                            }
                        }
                    }
                }
                else if (shape.type === "Line"){
                    const a = shape.from
                    const b = shape.to
        
                    const x0 = render_transform.view_transform_x(a), y0 = render_transform.view_transform_y(a)
                    const x1 = render_transform.view_transform_x(b), y1 = render_transform.view_transform_y(b)
                    const invalid0 = isNaN(x0) || isNaN(y0)
                    const invalid1 = isNaN(x1) || isNaN(y1)
        
                    if (!invalid0 && !invalid1) {
                        switch (shape.shape){
                            case "Arrow": {
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
                                break
                            }
                            default:
                            case "Line": {
                                context.beginPath()
                                // line
                                context.moveTo(x0, y0)
                                context.lineTo(x1, y1)
                                context.stroke()
                                break
                            }
                                
                        }
                    }
                }
            }
        }
    }

    function set_view_transform(transform: ViewTransform): void {
        render_transform = transform
    }

    const renderer: Renderer = {
        render_v2: render,
        set_view_transform,
        set_viewport_index: index => viewport_index = index,
    }
    return renderer
}
