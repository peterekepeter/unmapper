import { createSignal } from "reactive-signals"

export const themeColors = createSignal({
    foreground : '#ccc',
    background : '#444',
    error: '#a00',
    accent : '#fa0',
})