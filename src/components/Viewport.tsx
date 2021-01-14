import { useState } from "react";
import { IRenderer } from "../render/IRenderer";
import { create_wireframe_renderer } from "../render/WireframeRenderer";
import { Vector } from "../model/Vector";
import React = require("react");
import { createController } from "../controller";
import { Rotation } from "../model/Rotation";
import { Matrix3x3 } from "../model/Matrix3x3";
import { ViewportMode } from "../model/ViewportMode";
import { UnrealMap } from "../model/UnrealMap";
import { ViewportState } from "../model/EditorState";


export const Viewport = ({
    viewport_index = 0,
    width = 500,
    height = 300,
    controller = createController(),
    map = new UnrealMap(),
    viewport_state = {} as ViewportState,
    vertex_mode = false}) => {

    let [canvas, set_canvas] = useState<HTMLCanvasElement>(null);

    let [renderer, set_renderer] = useState<IRenderer>(null);

    const view_mode = viewport_state.mode;

    let [isMouseDown, setMouseDown] = useState(false);
    let [didMouseMove, setDidMouseMove] = useState(false);

    let [last_render_map, set_last_render_map] = useState<UnrealMap>(null);
    let [last_render_viewport, set_last_render_viewport] = useState<ViewportState>(null);
    let [last_vertex_mode, set_last_vertex_mode] = useState<boolean>(null);
    let [last_width, set_last_width] = useState<number>(null);
    let [last_height, set_last_height] = useState<number>(null);

    function canvas_ref(new_canvas: HTMLCanvasElement) {
        if (new_canvas == null)
        {
            return;
        }
        if (new_canvas !== canvas){
            set_canvas(new_canvas);
            set_renderer(create_wireframe_renderer(new_canvas));
            return;
        }
        let needs_render = false;
        if (last_render_map !== map){
            set_last_render_map(map);
            needs_render = true;
        }
        if (last_render_viewport !== viewport_state){
            set_last_render_viewport(viewport_state);
            needs_render = true;
        }
        if (last_vertex_mode !== vertex_mode){
            set_last_vertex_mode(vertex_mode);
            needs_render = true;
        }
        if (last_width !== width){
            set_last_width(width);
            needs_render = true;
        }
        if (last_height !== height){
            set_last_height(height);
            needs_render = true;
        }
        if (needs_render){
            renderUpdate(renderer);
        }
    }

    function get_ortoho_scale(){
        const levels_per_double = 4;
        const scale = 1/4096*Math.pow(2, viewport_state.zoom_level/levels_per_double); 
        return scale;
    }

    function renderUpdate(target: IRenderer) {
        if (target != null) {
            const perspectiveFov = 90;
            const scale = get_ortoho_scale();
            target.setShowVertexes(vertex_mode);
            target.setCenterTo(viewport_state.center_location);
            switch (view_mode) {
                case ViewportMode.Perspective:
                    target.setPerspectiveRotation(viewport_state.rotation);
                    target.setPerspectiveMode(perspectiveFov);
                    break;
                case ViewportMode.Top:
                    target.setTopMode(scale);
                    break;
                case ViewportMode.Front:
                    target.setFrontMode(scale);
                    break;
                case ViewportMode.Side:
                    target.setSideMode(scale);
                    break;
            }
            // re-render
            const before_time = Date.now();
            target.render(map);
            const delta_time = Date.now() - before_time;
            // console.log('re-render viewport', viewport_index, 'took', delta_time, 'ms', viewport_state.center_location);
        }
    }

    const usePointerLock = false;
    const normalDragDirection = true;

    return <canvas
        width={width}
        height={height}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        ref={canvas => canvas_ref(canvas)}
        style={{
            maxWidth: '100%',
            maxHeight: '100%'
        }} />;

    function onContextMenu(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();
    }

    function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
        canvas.setPointerCapture(event.pointerId);
        if (usePointerLock && canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
        setMouseDown(true);
        setDidMouseMove(false);
    }

    function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
        canvas.releasePointerCapture(event.pointerId);
        if (usePointerLock && document.exitPointerLock) {
            document.exitPointerLock();
        }
        if (!didMouseMove) {
            const canvasX = event.pageX - canvas.offsetLeft;
            const canvasY = event.pageY - canvas.offsetTop;
            if (vertex_mode){
                const [actor, vertexIndex] = renderer.findNearestVertex(map, canvasX, canvasY);
                if (event.ctrlKey){
                    controller.selectToggleVertex(actor, vertexIndex);
                } else {
                    controller.selectVertex(actor, vertexIndex);
                }
            } else {
                const actor = renderer.findNearestActor(map, canvasX, canvasY);
                if (event.ctrlKey) {
                    controller.toggleSelection(actor);
                } else {
                    controller.makeSelection(actor);
                }
            }
        }
        setMouseDown(false);
    }

    function onWheel(event: React.WheelEvent){
        let new_zoom_level = viewport_state.zoom_level;
        if (event.deltaY > 0){
            new_zoom_level--;
        }
        if (event.deltaY < 0){
            new_zoom_level ++;
        }
        controller.set_viewport_zoom_level(viewport_index, new_zoom_level);
        event.preventDefault();
        return false;
    }

    function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {


        if (!isMouseDown) {
            return;
        }
        let dx = event.movementX;
        let dy = event.movementY;
        if (normalDragDirection) {
            dx *= -1;
            dy *= -1;
        }
        const ortohoScale = get_ortoho_scale();
        const deviceSize = Math.min(width, height);
        const scale = ortohoScale * deviceSize;
        setDidMouseMove(true);
        const [next_rotation, nextLocation] =
            nextViewState(viewport_state.center_location, viewport_state.rotation, view_mode, dx, dy, event.buttons, deviceSize, ortohoScale);
        controller.update_view_location(viewport_index, nextLocation);
        controller.update_view_rotation(viewport_index, next_rotation);
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
    ortohoScale: number)
    : [Rotation, Vector] {
    let nextRotation = rotation;
    let nextLocation = location;

    const leftPress = pointerButtons === 1;
    const rightPress = pointerButtons === 2;
    const bothPress = pointerButtons === 3;

    const scale = deviceSize * ortohoScale;
    const scaledX = moveX / scale;
    const scaledY = moveY / scale;
    const normX = moveX / deviceSize;
    const normY = moveY / deviceSize;

    const perspectiveRotateSpeed = 90;
    const perspectiveMoveSpeed = 1024;

    switch (viewmode) {
        case ViewportMode.Perspective:
            if (leftPress) {
                const dir = rotation.toMatrix().apply(Vector.FORWARD);
                nextLocation = location.add(dir.x * normY * perspectiveMoveSpeed, dir.y * normY * perspectiveMoveSpeed, 0);
                nextRotation = rotation.add(0, -normX * perspectiveRotateSpeed, 0);
            } else if (rightPress) {
                nextRotation = rotation.add(normY * perspectiveRotateSpeed, -normX * perspectiveRotateSpeed, 0);
            } else if (bothPress) {
                const matrix = Matrix3x3
                    .rotateDegreesZ(rotation.yaw)
                    .rotateDegreesY(rotation.pitch);
                const forward = matrix.apply(Vector.UP);
                const right = matrix.apply(Vector.RIGHT);
                nextLocation = location
                    .addVector(Vector.UP.scale(normY * perspectiveMoveSpeed))
                    .addVector(right.scale(-normX * perspectiveMoveSpeed));
            }

            break;
        case ViewportMode.Top:
            nextLocation = location.add(scaledX, scaledY, 0);
            break;
        case ViewportMode.Front:
            nextLocation = location.add(scaledX, 0, -scaledY);
            break;
        case ViewportMode.Side:
            nextLocation = location.add(0, scaledX, -scaledY);
            break;
    }
    return [nextRotation, nextLocation];
}