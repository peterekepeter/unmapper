import { UnrealMap } from "../model/UnrealMap";
import { ISignal, createSignal } from "reactive-signals";
import { ICommand } from "./ICommand";


interface IHistory
{
    push : ICommand;
    forward : ICommand;
    back : ICommand
}

export function createHistory(map : ISignal<UnrealMap>) : IHistory {
    
    var past : UnrealMap[] = [];
    var future : UnrealMap[] = [];

    function push()
    {
        past.push(map.value);
        if (future.length > 0){
            future = [];
        }
        updateBoth();
    }

    function back()
    {
        future.push(map.value);
        map.value = past.pop();
        updateBoth();
    }

    function forward()
    {
        past.push(map.value);
        map.value = future.pop();
        updateBoth();
    }

    back.canExecute = createSignal(false);
    forward.canExecute = createSignal(false);

    function updateBoth(){
        back.canExecute.value = past.length > 0;
        forward.canExecute.value = future.length > 0;
    }

    return {
        push,
        back,
        forward
    }

}