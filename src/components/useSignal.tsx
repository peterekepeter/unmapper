import { useState, useEffect } from "react"
import { ISignal } from "reactive-signals"

export function use_signal<T>(signal: ISignal<T>) {
    const [state, set_state] = useState(signal.value)
    useEffect(() => {
        const subscription = signal.subscribe(() => {
            set_state(signal.value)
        })
        return subscription.cancel
    })
    return state
}
