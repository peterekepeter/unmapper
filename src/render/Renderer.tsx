import { EditorState } from "../model/EditorState"
import { ViewTransform } from "./ViewTransform"

export interface Renderer {
    set_view_transform(view_transform: ViewTransform): void;
    set_viewport_index(viewport_index: number): void;
    render_v2(state: EditorState): void;
}