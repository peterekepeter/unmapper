import { createSignal } from 'reactive-signals';
import { UnrealMap } from '../model/UnrealMap';
import { loadMapFromString } from '../model/loader';

export const createController = () => {

    var map = createSignal(new UnrealMap());

    function loadFromString(str:string){
        map.value = loadMapFromString(str);
    }

    return {
        map,
        loadFromString
    }
}