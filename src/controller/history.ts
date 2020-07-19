import { UnrealMap } from "../model/UnrealMap";
import { ISignal } from "reactive-signals";



function history(map : ISignal<UnrealMap>){
    
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

    return {
        push, 
        back,
        forward
    }

}