
export enum ViewportMode {
    Top = "Top",
    Front = "Front",
    Side = "Side",
    Perspective = "Perspective",
    UV = "UV"
}

export const ALL_VIEWPORT_MODES = [
    ViewportMode.Top, 
    ViewportMode.Front, 
    ViewportMode.Side,
    ViewportMode.Perspective, 
    ViewportMode.UV
]

export function viewport_mode_rotateable(mode: ViewportMode): boolean{
    return mode === ViewportMode.Perspective
}