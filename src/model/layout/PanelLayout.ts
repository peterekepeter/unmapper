export enum PanelType {
    Empty = 0,
    Objects = 1,
    Properties = 2, 
    Viewport = 3,
}

export enum PanelSplitDirection {
    Horizontal = 0,
    Vertical = 1,
}

export type PanelLayout =
{
    split_percentage: number
    split_direction: PanelSplitDirection
    left_child: PanelLayout
    right_child: PanelLayout
} | PanelType

export const EMPTY_PANEL_LAYOUT : PanelLayout = PanelType.Empty

export function normalizePanelLayout(layout: PanelLayout): PanelLayout
{
    if (layout == null){
        return EMPTY_PANEL_LAYOUT
    }
    if (typeof layout === 'number'){
        return layout
    }
    if (layout){
        if (layout.split_percentage <= 0){
            return normalizePanelLayout(layout.right_child)
        } 
        if (layout.split_percentage >= 1) {
            return normalizePanelLayout(layout.left_child)
        }
        const fixedLeft: PanelLayout = normalizePanelLayout(layout.left_child)
        const fixedRight: PanelLayout = normalizePanelLayout(layout.left_child)
        const split = layout.split_percentage ?? 0.5
        const direction = layout.split_direction !== PanelSplitDirection.Horizontal && layout.split_direction !== PanelSplitDirection.Vertical 
            ? PanelSplitDirection.Horizontal : layout.split_direction
        if (layout.left_child !== fixedLeft ||
            layout.right_child !== fixedRight ||
            layout.split_percentage !== split ||
            layout.split_direction !== direction
        ) {
            const fixed : PanelLayout = {
                split_percentage: split,
                split_direction: direction,
                left_child: fixedLeft,
                right_child: fixedRight,
            }
            return fixed
        }
        else {
            return layout
        }
    }
    else {
        return EMPTY_PANEL_LAYOUT
    }
}
