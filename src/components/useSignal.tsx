import { useState, useEffect } from "react";
import { ISignal } from "reactive-signals";
export function useSignal<T>(signal: ISignal<T>) {
    const [state, setState] = useState(signal.value);
    useEffect(() => {
        var subscription = signal.subscribe(() => {
            setState(signal.value);
        });
        return subscription.cancel;
    });
    return state;
}
