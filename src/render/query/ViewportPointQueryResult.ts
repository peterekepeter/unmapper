import { EditorSelection } from "../../model/EditorSelection"
import { Vector } from "../../model/Vector"
import { SnapResult } from "./SnapResult"

export interface ViewportPointQueryResult {
    selection: EditorSelection;
    location: Vector;
    snap?: SnapResult;
}
