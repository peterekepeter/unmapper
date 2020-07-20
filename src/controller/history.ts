import { UnrealMap } from "../model/UnrealMap";
import { ISignal, createSignal } from "reactive-signals";
import { ICommand } from "./ICommand";


interface IHistory
{
    push : ICommand;
    forward : ICommand;
    back : ICommand
}

function history(map : ISignal<UnrealMap>) : IHistory {
    
    var past : UnrealMap[] = [];
    var future : UnrealMap[] = [];

    function push()
    {
        past.push(map.value);
        if (future.length > 0){
            future = [];
        }
    }

    function canPush(){
        return true;
    }

    function back()
    {
        future.push(map.value);
        map.value = past.pop();
    }

    function canBack(){
        return past.length > 0;
    }

    function forward()
    {
        past.push(map.value);
        map.value = future.pop();
    }

    function canForward(){
        return future.length > 0;
    }

    const canPushSignal = createSignal(true);
    const canBackSignal = createSignal(false);
    const canForwardSignal = createSignal(false);

    function updateSignals(){
        canBackSignal.value = canBack();
        canForwardSignal.value = canForward();
    }

    return {
        push: { execute : push, canExecute: canPushSignal },
        back:  { execute : back, canExecute: canBackSignal }, 
        forward: { execute : forward, canExecute: canForwardSignal } 
    }

}