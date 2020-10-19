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
        const next : Actor = {...prev, selected : !prev.selected };
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
            return a.selected === shouldBeSelected 
                ? a : {...a, selected:shouldBeSelected}
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
                return {
                    ...a, location: a.location.add(-32,-32,-32)
                }
            }   
            else {
                return a;
            }
        }))
    }

    function updateSelectedBrushes(op: (brush: BrushModel) => BrushModel){
        history.push();
        updateActorList(map.value.actors.map(a => {
            if (a.selected && a.brushModel){
                const newBrush = op(a.brushModel);
                if (newBrush === a.brushModel){
                    return a;
                }
                return {
                    ...a, brushModel: newBrush
                }
            }   
            else {
                return a;
            }
        }))
    }

    function triangulateMeshPolygons(){
        updateSelectedBrushes(triangulateBrush);
    }

    function shuffleMeshPolygons(){
        updateSelectedBrushes(shuffleBrushPolygons);
    }

    function alignMeshVertexesToGrid(){
        updateSelectedBrushes(brush => alignBrushModelToGrid(brush, new Vector(32,32,32)));
    }

    return {
        map,
        commandsShownState,
        loadFromString,
        toggleSelection,
        makeSelection,
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
    }
}