import { createSignal } from 'reactive-signals';
import { UnrealMap } from '../model/UnrealMap';
import { loadMapFromString, storeMapToString } from '../model/loader';
import { Actor } from '../model/Actor';
import { create_history } from './history';
import { Vector } from '../model/Vector';
import { triangulateBrush } from '../model/algorithms/triangluate';
import { shuffleBrushPolygons } from '../model/algorithms/shuffle';
import { alignBrushModelToGrid, alignToGrid } from '../model/algorithms/alignToGrid';
import { BrushModel } from '../model/BrushModel';
import { uv_triplanar_map } from '../model/algorithms/uv-triplanar-map';
import { create_initial_editor_state, EditorState } from '../model/EditorState';
import { create_command_registry, ICommandInfoV2 } from './command_registry';
import { change_actors_list, change_map, change_viewport_at_index, select_actors, select_actors_list } from '../model/algorithms/common';
import { Rotation } from '../model/Rotation';
import { ViewportMode } from '../model/ViewportMode';

export const createController = () => {

    const state_signal = createSignal<EditorState>(create_initial_editor_state());
    const command_registry = create_command_registry();
    var history = create_history(state_signal);
    var commandsShownState = createSignal(false);

    async function execute_undoable_command(command_info: ICommandInfoV2){
        const next_state = await command_info.implementation(state_signal.value);
        if (command_info.legacy_handling){
            // legacy commands update state_signal & history directly
            return;
        }
        undoable_state_change(next_state);
    }

    function undoable_state_change(next_state: EditorState)
    {
        if (state_signal.value === next_state){
            // no change
            return;
        }
        if (state_signal.value.map !== next_state.map){
            // map state change triggers history push
            history.push();
        }
        state_signal.value = next_state;
    }

    function toggle_actor_selected(actor_ref: Actor)
    {
        if (actor_ref == null) return; // nothing to toggle
        const next = actor_ref.shallowCopy(); 
        next.selected = !actor_ref.selected;
        updateActor(actor_ref, next);
    }

    function make_actor_selection(actor: Actor)
    {
        updateActorList(select_actors_list(state_signal.value.map.actors, a => a === actor));
    }

    function updateActor(prev: Actor, next: Actor)
    {
        const newActors = state_signal.value.map.actors.map(a => a === prev ? next : a);
        updateActorList(newActors);
    }

    function updateActorList(actors : Actor[]){
        state_signal.value = change_actors_list(state_signal.value, () => actors);
    }

    function showAllCommands(){
        commandsShownState.value = true;
    }

    function importFromString(str : string){
        const newData = loadMapFromString(str);
        updateActorList([
            ...state_signal.value.map.actors,
            ...newData.actors
        ])
    }

    function exportSelectionToString() : string {
        const actors = state_signal.value.map.actors.filter(a => a.selected);
        const mapToExport = new UnrealMap();
        mapToExport.actors = actors;
        return storeMapToString(mapToExport);
    }

    function set_viewport_zoom_level(index: number, level: number)
    {
        console.log('set_viewport_zoom_level', index, level);
    }

    function undoCopyMove() {
        updateActorList(state_signal.value.map.actors.map(a => {
            if (a.selected){
                const copy = a.shallowCopy();
                a.location = a.location.add(-32,-32,-32);
                return a;
            }   
            else {
                return a;
            }
        }))
    }

    function update_view_location(viewport_index: number, location: Vector){
        state_signal.value = change_viewport_at_index(state_signal.value, viewport_index, viewport => {
            return { ...viewport, center_location: location }
        });
    }

    function set_viewport_mode(viewport_index: number, mode: ViewportMode){
        state_signal.value = change_viewport_at_index(state_signal.value, viewport_index, viewport => {
            return { ...viewport, mode }
        });
    }

    function update_view_rotation(viewport_index: number, rotation: Rotation){
        state_signal.value = change_viewport_at_index(state_signal.value, viewport_index, viewport => {
            return { ...viewport, rotation: rotation }
        });
    }

    function modifyBrushes(op: (brush: BrushModel, actor: Actor) => BrushModel) {
        updateActorList(state_signal.value.map.actors.map(a => {
            if (a.brushModel){
                const newBrush = op(a.brushModel, a);
                if (newBrush == null){
                    throw new Error('op should not return null');
                }
                if (newBrush === a.brushModel){
                    return a;
                }
                const copy = a.shallowCopy();
                copy.brushModel = newBrush;
                return copy;
            }   
            else {
                return a;
            }
        }))

    }

    function flipPolygonNormal(){
        modifySelectedBrushes(oldBrush => {
            const selected = [];
            for (let i=0; i<oldBrush.vertexes.length; i++){
                const vertex = oldBrush.vertexes[i];
                if (vertex.selected){
                    selected.push(i);
                }
            }
            if (selected.length < 3){
                return oldBrush;
            }
            const nextBrush = oldBrush.shallowCopy();
            let polyListCopied = false;
            for (let i=0; i<nextBrush.polygons.length; i++){
                const poly = nextBrush.polygons[i];
                let polySelected = true;
                for (const polyVertexIndex of poly.vertexes){
                    if (selected.indexOf(polyVertexIndex) === -1){
                        polySelected = false;
                        break;
                    }
                }
                if (polySelected){
                    if (polyListCopied){
                        nextBrush.polygons = nextBrush.polygons.slice();
                    }
                    const newPoly = poly.shallowCopy();
                    nextBrush.polygons[i] = newPoly;
                    newPoly.vertexes = newPoly.vertexes.slice().reverse();
                    newPoly.normal = Vector.ZERO.subtract(newPoly.normal.x, newPoly.normal.y, newPoly.normal.z);
                }
            }
            return nextBrush;
        })    
    }

    function uv_triplanar_map_selected(){
        history.push();
        modifySelectedBrushes(brush => uv_triplanar_map(brush));
    }

    function modifySelectedBrushes(op: (brush: BrushModel, actor: Actor) => BrushModel){
        modifyBrushes((brush, actor) => {
            if (actor.selected){
                return op(brush, actor);
            } else {
                return brush;
            }
        })
    }

    function triangulateMeshPolygons(){
        history.push();
        modifySelectedBrushes(triangulateBrush);
    }

    function shuffleMeshPolygons(){
        history.push();
        modifySelectedBrushes(shuffleBrushPolygons);
    }

    function alignMeshVertexesToGrid(size: number){
        history.push();
        const grid = new Vector(size, size, size);
        modifySelectedBrushes(brush => {
            if (state_signal.value.vertex_mode === true){
                const next = brush.shallowCopy();
                next.vertexes = next.vertexes.map(currentVertex => {
                    if (currentVertex.selected){
                        const nextVertex = currentVertex.shallowCopy();
                        nextVertex.position = alignToGrid(nextVertex.position, grid);
                        return nextVertex;
                    } else {
                        return currentVertex;
                    }
                })
                return next;
            } else {
                return alignBrushModelToGrid(brush, grid)
            }
        });
    }

    function selectToggleVertex(target : Actor, vertexIndex : number)
    {
        modifyBrushes((brush, actor) => {
            if (actor !== target || !target.selected){
                if (target.brushModel.vertexes.findIndex(v => v.selected) !== -1){
                    const newBrush = target.brushModel.shallowCopy();
                    newBrush.vertexes = brush.vertexes.map((vertex) => {
                        if (vertex.selected){
                            const newVertex = vertex.shallowCopy();
                            newVertex.selected = false;
                            return newVertex;
                        } else {
                            return vertex
                        }
                    })
                }
                return brush;
            }
            const newBrush = target.brushModel.shallowCopy();
            newBrush.vertexes = brush.vertexes.map((vertex, index) => {
                if (index === vertexIndex){
                    const newVertex = vertex.shallowCopy();
                    newVertex.selected = !vertex.selected;
                    return newVertex;
                } else {
                    return vertex;
                }
            })
            return newBrush;
        })
    }

    function selectVertex(target : Actor, vertexIndex : number){
        modifyBrushes((brush, actor) => {
            if (target === actor && brush.vertexes[vertexIndex].selected
              ||target !== actor && brush.vertexes.findIndex(v => v.selected) === -1) {
                return brush;
            }
            const newBrush = actor.brushModel.shallowCopy();
            newBrush.vertexes = brush.vertexes.map((vertex, index) => {
                const shouldBeSelected = target === actor && index === vertexIndex;
                if (shouldBeSelected !== vertex.selected){
                    const newVertex = vertex.shallowCopy();
                    newVertex.selected = shouldBeSelected;
                    return newVertex;
                } else {
                    return vertex;
                }
            });
            return newBrush;
        }) 
    }

    return {
        execute: execute_undoable_command,
        commands: command_registry,
        state_signal,
        commandsShownState,
        toggleSelection: toggle_actor_selected,
        makeSelection: make_actor_selection,
        selectToggleVertex,
        selectVertex,
        flipPolygonNormal,
        triangulateMeshPolygons,
        shuffleMeshPolygons,
        alignMeshVertexesToGrid,
        uv_triplanar_map_selected,
        set_viewport_zoom_level,
        set_viewport_mode,
        update_view_rotation,
        undoCopyMove,
        showAllCommands,
        undo: history.back,
        redo: history.forward,
        importFromString,
        exportSelectionToString,
        update_view_location,
    }
}