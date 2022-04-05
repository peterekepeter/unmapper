import { useEffect, useState } from "react"

import { Signal } from "./Signal"


export function useSignal<T>(signal: Signal<T>): T {
    const [state, set_state] = useState(signal.value)
    useEffect(() => {
        const subscription = signal.subscribe(() => {
            set_state(signal.value)
        })
        return subscription.cancel
    }, [])
    return state
}
