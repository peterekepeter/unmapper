import { createSignal } from "reactive-signals";


interface IHistory<T>
{
    push : () => void;
    forward : () => void;
    back : () => void;
    get_next_state: () => T;
    get_previous_state: () => T;
}

export function create_history<T>(get_current_state: () => T, set_current_state: (t:T) => void) : IHistory<T> {
    
    const past : T[] = [];
    let future : T[] = [];

    function push()
    {
        past.push(get_current_state());
        if (future.length > 0){
            future = [];
        }
        updateBoth();
    }

    function back()
    {
        if (past.length <= 0){
            throw new Error('no past');
        }
        future.push(get_current_state());
        set_current_state(past.pop());
        updateBoth();
    }

    function forward()
    {
        if (future.length <= 0){
            throw new Error('no future');
        }
        past.push(get_current_state());
        set_current_state(future.pop());
        updateBoth();
    }

    back.canExecute = createSignal(false);
    forward.canExecute = createSignal(false);

    function updateBoth(){
        back.canExecute.value = past.length > 0;
        forward.canExecute.value = future.length > 0;
    }

    function get_next_state(){
        return future.length > 0 ? future[future.length - 1] : null;
    }

    function get_previous_state(){
        return past.length > 0 ? past[past.length - 1] : null;
    }

    return {
        push,
        back,
        forward,
        get_next_state,
        get_previous_state,
    }

}