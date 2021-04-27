import { ViewportMode } from "../../model/ViewportMode"
import { ViewTransform } from "../ViewTransform"
import { FrontViewTransform } from "./FrontViewTransform"
import { PerspectiveViewTransform } from "./PerspectiveViewTransform"
import { SideViewTransform } from "./SideViewTransform"
import { TopViewTransform } from "./TopViewTransform"

export function create_view_transform(mode: ViewportMode): ViewTransform {
    switch (mode) {
        case ViewportMode.UV:
        case ViewportMode.Top:
            return new TopViewTransform()
        case ViewportMode.Front:
            return new FrontViewTransform()
        case ViewportMode.Side:
            return new SideViewTransform()
        case ViewportMode.Perspective:
            return new PerspectiveViewTransform()
    }
}