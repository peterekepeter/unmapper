import { createSignal } from 'reactive-signals';
import { UnrealMap } from '../model/UnrealMap';
import { loadMapFromString } from '../model/loader';
import { Actor } from '../model/Actor';
import { createHistory } from './history';

export const createController = () => {

    var map = createSignal(new UnrealMap());
    var history = createHistory(map);

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
        let change = false;
        const newActors = map.value.actors.map<Actor>(a => {
            const shouldBeSelected = a === actor;
            change = change || a.selected !== shouldBeSelected;
            return a.selected === shouldBeSelected 
                ? a : {...a, selected:shouldBeSelected}
        });
        if (change) updateActorList(newActors);
    }

    function deleteSelected(){
        const newActors = map.value.actors.filter(a => !a.selected);
        if (newActors.length !== map.value.actors.length){
            history.push.execute();
            updateActorList(newActors);
        }
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

    return {
        map,
        loadFromString,
        toggleSelection,
        makeSelection,
        deleteSelected,
        undo: history.back,
        redo: history.forward
    }
}