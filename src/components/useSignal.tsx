import { useEffect, useState } from "react"

import { Signal } from "../util/Signal"

export function use_signal<T>(signal: Signal<T>) {
    const [state, set_state] = useState(signal.value)
    useEffect(() => {
        const subscription = signal.subscribe(() => {
            set_state(signal.value)
        })
        return subscription.cancel
    })
    return state
}
