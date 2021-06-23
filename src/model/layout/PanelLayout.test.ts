import { normalizePanelLayout, PanelLayout, PanelSplitDirection, PanelType } from "./PanelLayout"

test('normalize layout removes obscured panels', () => {
    const layout: PanelLayout = {
        split_direction: PanelSplitDirection.Vertical,
        split_percentage: 0,
        left_child: PanelType.Objects,
        right_child: PanelType.Viewport
    }
    expect(normalizePanelLayout(layout)).toEqual(PanelType.Viewport)
})