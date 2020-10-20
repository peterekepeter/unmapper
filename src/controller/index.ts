import { createSignal } from 'reactive-signals';
import { UnrealMap } from '../model/UnrealMap';
import { loadMapFromString, storeMapToString } from '../model/loader';
import { Actor } from '../model/Actor';
import { createHistory } from './history';
import { Vector } from '../model/Vector';
import { triangulateBrush } from '../model/algorithms/triangluate';
import { shuffle, shuffleBrushPolygons } from '../model/algorithms/shuffle';
import { alignBrushModelToGrid, alignToGrid } from '../model/algorithms/alignToGrid';
import { BrushModel } from '../model/BrushModel';

export const createController = () => {

    var vertexMode = createSignal(false);
    var map = createSignal(new UnrealMap());
    var history = createHistory(map);
    var commandsShownState = createSignal(false);

    //@ts-ignore
    map.event(map => window.map = map)

    function loadFromString(str:string){
        map.value = loadMapFromString(str);
    }

    function toggleSelection(prev: Actor)
    {
        if (prev == null) return; // nothing to toggle
        const next = prev.shallowCopy(); 
        next.selected = !prev.selected;
        updateActor(prev, next);
    }

    function makeSelection(actor: Actor)
    {
        selectActors(a => a === actor);
    }

    function selectAll(){
        selectActors((_) => true);
    }

    function deleteSelected(){
        const newActors = map.value.actors.filter(a => !a.selected);
        if (newActors.length !== map.value.actors.length){
            history.push();
            updateActorList(newActors);
        }
    }

    function selectActors(filter: (actor : Actor) => boolean)
    {
        let change = false;
        const newActors = map.value.actors.map<Actor>(a => {
            const shouldBeSelected = filter(a);
            change = change || a.selected !== shouldBeSelected;
            if (a.selected === shouldBeSelected){
                return a;
            } else {
                const next = a.shallowCopy();
                next.selected = shouldBeSelected;
                return next;
            }
        });
        if (change) updateActorList(newActors);
    }
    function updateActor(prev: Actor, next: Actor)
    {
        const newActors = map.value.actors.map(a => a === prev ? next : a);
        updateActorList(newActors);
    }

    function updateActorList(actors : Actor[]){
        const nextMap = new UnrealMap();
        nextMap.actors = actors;
        map.value = nextMap;
    }

    function showAllCommands(){
        commandsShownState.value = true;
    }

    function importFromString(str : string){
        const newData = loadMapFromString(str);
        updateActorList([
            ...map.value.actors,
            ...newData.actors
        ])
    }

    function exportSelectionToString() : string {
        const actors = map.value.actors.filter(a => a.selected);
        const mapToExport = new UnrealMap();
        mapToExport.actors = actors;
        return storeMapToString(mapToExport);
    }

    function undoCopyMove() {
        updateActorList(map.value.actors.map(a => {
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

    function modifyBrushes(op: (brush: BrushModel, actor: Actor) => BrushModel) {
        updateActorList(map.value.actors.map(a => {
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

    function alignMeshVertexesToGrid(){
        history.push();
        modifySelectedBrushes(brush => alignBrushModelToGrid(brush, new Vector(32,32,32)));
    }

    function toggleVertexMode(){
        vertexMode.value = !vertexMode.value;
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
        map,
        vertexMode,
        commandsShownState,
        loadFromString,
        toggleSelection,
        makeSelection,
        selectToggleVertex,
        selectVertex,
        deleteSelected,
        triangulateMeshPolygons,
        shuffleMeshPolygons,
        alignMeshVertexesToGrid,
        undoCopyMove,
        selectAll,
        showAllCommands,
        undo: history.back,
        redo: history.forward,
        importFromString,
        exportSelectionToString,
        toggleVertexMode,
    }
}