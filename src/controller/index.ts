import { createSignal } from 'reactive-signals';
import { UnrealMap } from '../model/UnrealMap';
import { loadMapFromString } from '../model/loader';
import { Actor } from '../model/Actor';

export const createController = () => {

    var map = createSignal(new UnrealMap());

    function loadFromString(str:string){
        map.value = loadMapFromString(str);
    }

    function toggleSelection(prev: Actor)
    {
        const next : Actor = {...prev, selected : !prev.selected };
        updateActor(prev, next);
    }

    function makeSelection(actor: Actor)
    {
        const newActors = map.value.actors.map<Actor>(a => {
            const shouldBeSelected = a === actor;
            return a.selected === shouldBeSelected 
                ? a : {...a, selected:shouldBeSelected}
        });
        updateActorList(newActors);
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
        makeSelection
    }
}