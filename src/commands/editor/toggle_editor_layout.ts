import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"
import { ImplementationError } from "../../model/error"
import { EditorError } from "../../model/error/EditorError"
import { PanelLayout, PanelSplitDirection, PanelType } from "../../model/layout/PanelLayout"


const LAYOUT_COUNT = 5

export const toggle_editor_layout_command : ICommandInfoV2 = {
    description: "Toogle Editor Layout",
    shortcut: "ctrl + alt + l",
    exec: toggle_editor_layout,
}

function toggle_editor_layout(state:EditorState): EditorState {
    const next_layout_index = (state.options.editor_layout + 1) % LAYOUT_COUNT
    return {
        ...state, 
        options: { 
            ...state.options, 
            editor_layout: next_layout_index,
            layout: build_layout(next_layout_index),
        },
    }
}

function build_layout(index: number): PanelLayout {
    EditorError.if(index >= LAYOUT_COUNT)
    EditorError.if(index < 0)
    switch (index) {
        case 0: return SIDEBAR_WITH_FOUR_VIEWPORTS
        case 1: return SIDEPANEL_WITH_TWO_VIEWPORTS
        case 2: return TWO_VIEWPORTS
        case 3: return FOUR_VIEWPORTS
        case 4: return SINGLE_VIEWPORT
        default: 
            throw new ImplementationError("not reachable")
    }
}

const HORIZONTAL_SPLIT = Object.freeze({
    split_direction: PanelSplitDirection.Horizontal,
    split_percentage: 0.5,
    left_child: PanelType.Viewport,
    right_child: PanelType.Viewport,
})

const VERTICAL_SPLIT = Object.freeze({
    ...HORIZONTAL_SPLIT,
    split_direction: PanelSplitDirection.Vertical,
})

const SIDEPANEL = Object.freeze({
    ...VERTICAL_SPLIT,
    left_child: PanelType.Objects,
    right_child: PanelType.Properties,
})

const SIDEPANEL_SPLIT = Object.freeze({
    ...HORIZONTAL_SPLIT,
    split_percentage: 0.2,
    left_child: SIDEPANEL,
    right_child: PanelType.Viewport,
})

const SIDEBAR_WITH_FOUR_VIEWPORTS = Object.freeze({
    ...SIDEPANEL_SPLIT,
    right_child: {
        ...HORIZONTAL_SPLIT,
        split_percentage: 0.66,
        left_child: VERTICAL_SPLIT,
        right_child: VERTICAL_SPLIT,
    },
})

const FOUR_VIEWPORTS = {
    ...HORIZONTAL_SPLIT,
    split_percentage: 0.66,
    left_child: VERTICAL_SPLIT,
    right_child: VERTICAL_SPLIT,
}

const SINGLE_VIEWPORT = PanelType.Viewport

const SIDEPANEL_WITH_TWO_VIEWPORTS = Object.freeze({
    ...SIDEPANEL_SPLIT,
    right_child: VERTICAL_SPLIT,
})

const TWO_VIEWPORTS = VERTICAL_SPLIT
