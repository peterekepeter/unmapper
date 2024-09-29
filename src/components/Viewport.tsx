import { FunctionComponent, useState } from "react"
import * as React from "react"

import { set_viewport_zoom_command as zoom } from "../commands/viewport/set_viewport_zoom"
import { update_view_location_command } from "../commands/viewport/update_view_location"
import { update_view_location_rotation_command } from "../commands/viewport/update_view_location_rotation"
import { AppController, create_controller } from "../controller/AppController"
import { InteractionRenderState } from "../controller/interactions/InteractionRenderState"
import { EditorSelection } from "../model/EditorSelection"
import { create_initial_editor_state, EditorOptions, EditorState, ViewportState } from "../model/EditorState"
import { EditorError } from "../model/error/EditorError"
import { Matrix3x3 } from "../model/Matrix3x3"
import { Rotation } from "../model/Rotation"
import { UnrealMap } from "../model/UnrealMap"
import { Vector } from "../model/Vector"
import { ViewportEvent } from "../model/ViewportEvent"
import { ViewportMode } from "../model/ViewportMode"
import { Renderer } from "../render/Renderer"
import { create_view_transform } from "../render/transform/create_view_transform"
import { ViewTransform } from "../render/ViewTransform"
import { create_wireframe_renderer } from "../render/WireframeRenderer"

export interface IViewportProps{
    viewport_index: number,
    width: number, 
    height: number, 
    controller: AppController,
    state: EditorState
}

interface InternalState{
    canvas: HTMLCanvasElement
    renderer: Renderer
    view_mode: ViewportMode
    view_transform: ViewTransform
    viewport_state: ViewportState
    ortoho_scale: number
    map: UnrealMap
    selection: EditorSelection
    interaction: InteractionRenderState
    editor_options: EditorOptions
    width: number
    height: number
}

export const Viewport : FunctionComponent<IViewportProps> = ({
    viewport_index = 0,
    width = 500,
    height = 300,
    controller = create_controller(),
    state = create_initial_editor_state(), 
}) => {
        

    const internal_state = React.useRef<InternalState>({
        canvas: null,
        renderer: null,
        view_mode: null,
        view_transform: null,
        viewport_state: null,
        ortoho_scale: null,
        map: null,
        selection: null,
        interaction: null, 
        editor_options: null,
        width: null, 
        height: null, 
    })


    const [isMouseDown, setMouseDown] = useState(false)
    const [did_mouse_move, setDidMouseMove] = useState(false)


    const usePointerLock = false
    const normalDragDirection = true
    const device_pixel_ratio = window.devicePixelRatio || 1

    return <canvas
        width={width*device_pixel_ratio}
        height={height*device_pixel_ratio}
        onWheel={handle_wheel}
        onContextMenu={handle_context_menu}
        onPointerDown={handle_pointer_down}
        onPointerUp={handle_pointer_up}
        onPointerMove={handle_pointer_move}
        ref={canvas => render_scene(canvas)} 
        style={{ width, height }}/>


    function render_scene(new_canvas: HTMLCanvasElement) {
        if (new_canvas == null){
            return
        }
        let need_render = false
        let new_view_transform = false
        let new_renderer = false
        const s = internal_state.current

        if (new_canvas !== s.canvas){
            s.canvas = new_canvas
            s.renderer = create_wireframe_renderer(new_canvas, controller.geometry_cache)
            need_render = true
            new_renderer = true
        }
        EditorError.if(s.renderer == null, "missing renderer")
        EditorError.if(s.canvas == null, "missing canvas")

        if (s.viewport_state !== state.viewports[viewport_index]){
            s.viewport_state = state.viewports[viewport_index]
            if (s.view_mode !== s.viewport_state.mode){
                s.view_mode = s.viewport_state.mode
                s.view_transform = create_view_transform(s.view_mode)
                new_view_transform = true
            }
            s.view_transform.view_rotation = s.viewport_state.rotation
            s.view_transform.view_center = s.viewport_state.center_location
            s.ortoho_scale = get_ortoho_scale(s.viewport_state.zoom_level)
            s.view_transform.scale = s.ortoho_scale
            s.view_transform.align_to_pixels()
            need_render = true
        }

        if (s.map !== state.map){
            s.map = state.map
            need_render = true
        }

        if (s.selection !== state.selection){
            s.selection = state.selection
            need_render = true
        }

        if (s.editor_options !== state.options){
            s.editor_options = state.options
            need_render = true
        }
    
        if (s.interaction !== state.interaction_render_state){
            s.interaction = state.interaction_render_state
            need_render = true
        }

        if (s.width !== s.canvas.width || s.height !== s.canvas.height || new_view_transform){
            s.width = s.canvas.width
            s.height = s.canvas.height
            s.view_transform.width = s.canvas.width
            s.view_transform.height = s.canvas.height
            s.view_transform.device_size = Math.min(s.canvas.width, s.canvas.height)
            s.view_transform.device_pixel_ratio = device_pixel_ratio
            s.view_transform.align_to_pixels()
            need_render = true
        }

        if (new_renderer || new_view_transform){
            s.renderer.set_view_transform(s.view_transform)
        }
    
        if (need_render) {
            const perspectiveFov = 90
            s.renderer.set_viewport_index(viewport_index)
            // re-render
            const before_time = Date.now()
            s.renderer.render_v2(controller.state_signal.value)
            const delta_time = Date.now() - before_time
            // console.log('re-render viewport', viewport_index, 'took', delta_time, 'ms', s.viewport_state.center_location);
            
        }
    }

    function get_ortoho_scale(zoom_level: number){
        const levels_per_double = 2
        const scale = 1/4096*2**(zoom_level/levels_per_double) 
        return scale
    }
    
    function handle_context_menu(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        event.stopPropagation()
        event.preventDefault()
    }

    function handle_pointer_down(event: React.PointerEvent<HTMLCanvasElement>) {
        const { canvas, renderer, view_mode, view_transform } = internal_state.current
        canvas.setPointerCapture(event.pointerId)
        if (usePointerLock && canvas.requestPointerLock) {
            canvas.requestPointerLock()
        }
        setMouseDown(true)
        setDidMouseMove(false)
        if (state.options.box_select_mode){
            const [canvas_x, canvas_y] = get_canvas_coords(event)
            const e : ViewportEvent = {
                canvas_x,
                canvas_y,
                ctrl_key: event.ctrlKey,
                renderer,
                view_mode,
                view_transform,
                viewport_index,
            }
            controller.interaction.pointer_down(e)
        }
        event.stopPropagation()
        event.preventDefault()
    }

    function handle_pointer_up(event: React.PointerEvent<HTMLCanvasElement>) {
        const { canvas, renderer, view_mode, view_transform } = internal_state.current
        canvas.releasePointerCapture(event.pointerId)
        if (usePointerLock && document.exitPointerLock) {
            document.exitPointerLock()
        }
        if (!did_mouse_move || state.options.box_select_mode) {
            const [canvas_x, canvas_y] = get_canvas_coords(event)
            const e : ViewportEvent = {
                canvas_x,
                canvas_y,
                ctrl_key: event.ctrlKey,
                renderer,
                view_mode,
                view_transform,
                viewport_index,
            }
            controller.interaction.pointer_up(e)
        }
        setMouseDown(false)
        event.stopPropagation()
        event.preventDefault()
    }


    function handle_wheel(event: React.WheelEvent){
        if (internal_state.current.view_mode === ViewportMode.Perspective){
            return false
        }
        let new_zoom_level = internal_state.current.viewport_state.zoom_level
        if (event.deltaY > 0){
            new_zoom_level--
        }
        if (event.deltaY < 0){
            new_zoom_level ++
        }
        controller.execute(zoom, viewport_index, new_zoom_level)
        // adjust for target
        const next_scale = get_ortoho_scale(new_zoom_level)
        const { renderer, view_mode, view_transform, viewport_state, ortoho_scale } = internal_state.current
        const [canvas_x, canvas_y] = get_canvas_coords(event)
        const s = next_scale/ortoho_scale
        
        // const zoom_target = controller.interaction.get_viewport_event_world_position({ canvas_x, canvas_y, ctrl_key: event.ctrlKey, renderer, view_mode, view_transform, viewport_index }).location
        const zoom_target = view_transform.canvas_to_world_location(canvas_x, canvas_y)
        const d_x = zoom_target.x - view_transform.view_center.x
        const d_y = zoom_target.y - view_transform.view_center.y
        const d_z = zoom_target.z - view_transform.view_center.z
        const new_location = view_transform.view_center.add_numbers(d_x*s - d_x, d_y*s - d_y, d_z*s - d_z)
        controller.execute(update_view_location_command, viewport_index, new_location )
        return false
    }

    function handle_pointer_move(event: React.PointerEvent<HTMLCanvasElement>) {
        const { renderer, view_mode, view_transform, viewport_state, ortoho_scale } = internal_state.current
        const [canvas_x, canvas_y] = get_canvas_coords(event)
    
        if (!isMouseDown || state.options.box_select_mode) {
            const e : ViewportEvent = {
                canvas_x,
                canvas_y,
                ctrl_key: event.ctrlKey,
                renderer,
                view_mode,
                view_transform,
                viewport_index,
            }
            controller.interaction.pointer_move(e)
            return
        }
        let dx = event.movementX
        let dy = event.movementY
        if (normalDragDirection) {
            dx *= -1
            dy *= -1
        }
        const device_size = Math.min(width, height)
        setDidMouseMove(true)
        const [next_rotation, nextLocation] =
            nextViewState(viewport_state.center_location, viewport_state.rotation, view_mode, dx, dy, event.buttons, device_size, ortoho_scale)
        controller.execute(update_view_location_rotation_command, viewport_index, nextLocation, next_rotation)
        event.stopPropagation()
        event.preventDefault()
    }

    function get_canvas_coords(event: { pageX: number, pageY: number }):[number, number]{
        const { canvas } = internal_state.current
        const rects = canvas.getClientRects()
        const canvas_x = (event.pageX - rects[0].x) * device_pixel_ratio
        const canvas_y = (event.pageY - rects[0].y) * device_pixel_ratio
        return [canvas_x, canvas_y]
    }

}


function nextViewState(
    location: Vector,
    rotation: Rotation,
    viewmode: ViewportMode,
    moveX: number,
    moveY: number,
    pointerButtons: number,
    deviceSize: number,
    ortohoScale: number,
)
    : [Rotation, Vector] {
    let nextRotation = rotation
    let nextLocation = location

    const leftPress = pointerButtons === 1
    const rightPress = pointerButtons === 2
    const bothPress = pointerButtons === 3

    const scale = deviceSize * ortohoScale
    const scaledX = moveX / scale
    const scaledY = moveY / scale
    const normX = moveX / deviceSize
    const normY = moveY / deviceSize

    const perspectiveRotateSpeed = 90
    const perspectiveMoveSpeed = 1024

    switch (viewmode) {
        case ViewportMode.Perspective: 
            if (leftPress) {
                const dir = rotation.to_matrix().apply(Vector.FORWARD)
                nextLocation = location.add_numbers(
                    dir.x * normY * perspectiveMoveSpeed, 
                    dir.y * normY * perspectiveMoveSpeed, 
                    0,
                )
                nextRotation = rotation.add(0, -normX * perspectiveRotateSpeed, 0)
            } else if (rightPress) {
                nextRotation = rotation.add(normY * perspectiveRotateSpeed, -normX * perspectiveRotateSpeed, 0)
            } else if (bothPress) {
                const matrix = Matrix3x3
                    .rotateDegreesZ(rotation.yaw)
                    .rotateDegreesY(rotation.pitch)
                const forward = matrix.apply(Vector.UP)
                const right = matrix.apply(Vector.RIGHT)
                nextLocation = location
                    .add_vector(Vector.UP.scale(normY * perspectiveMoveSpeed))
                    .add_vector(right.scale(-normX * perspectiveMoveSpeed))
            }

            break
        case ViewportMode.UV:
        case ViewportMode.Top:
            nextLocation = location.add_numbers(scaledX, scaledY, 0)
            break
        case ViewportMode.Front:
            nextLocation = location.add_numbers(0, scaledX, -scaledY)
            break
        case ViewportMode.Side:
            nextLocation = location.add_numbers(scaledX, 0, -scaledY)
            break
    }
    return [nextRotation, nextLocation]
}
