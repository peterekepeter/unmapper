import { ICommandInfoV2 } from "../../controller/command";
import { EditorState } from "../../model/EditorState";
import { EditorError } from "../../model/error/EditorError";
import { normalizePanelLayout, PanelLayout } from "../../model/layout/PanelLayout";

export const set_layout_split_percentage_command: ICommandInfoV2 = {    
    exec: set_layout_split_percentage,
    description: "Set split percentage between panels"
}

export function set_layout_split_percentage(
    state: EditorState, 
    path: string, 
    percentage: number
): EditorState {
    EditorError.if(typeof path !== 'string', "path parameter required")
    EditorError.if(typeof percentage !== 'number', "percentage parameter required")
    percentage = Math.min(1, Math.max(0, percentage))

    const layout = update_layout_with_split_percentage(
        state.options.layout, path, 0, percentage)

    return { 
        ...state, 
        options: { 
            ...state.options, 
            layout
        } 
    }
}

function update_layout_with_split_percentage(
    layout: PanelLayout, 
    path: string, 
    pathIndex: number,
    percentage: number): PanelLayout {
    if (typeof layout === 'number'){
        throw new EditorError('invalid path')
    }
    if (pathIndex >= path.length){
        return { 
            ...layout, 
            split_percentage: percentage 
        }
    }
    if (path[pathIndex] === 'l'){
        return { 
            ...layout, 
            left_child: update_layout_with_split_percentage(
                layout.left_child, path, pathIndex+1, percentage) 
        }
    } 
    else if(path[pathIndex] === 'r'){
        return { 
            ...layout, 
            right_child: update_layout_with_split_percentage(
                layout.right_child, path, pathIndex+1, percentage) 
        }
    } 
    else throw new EditorError('bad path char')
}
