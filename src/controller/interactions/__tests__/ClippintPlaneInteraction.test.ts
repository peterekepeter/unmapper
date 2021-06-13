import { Plane } from "../../../model/Plane";
import { Vector } from "../../../model/Vector";
import { ViewportEvent } from "../../../model/ViewportEvent";
import { ViewportMode } from "../../../model/ViewportMode";
import { ClippingPlaneInteraction } from "../ClippingPlaneInteraction";


const data: [ViewportMode, Vector, Plane][] = [
    [ViewportMode.Top, new Vector(1, 0, 0), Plane.XZ],
    [ViewportMode.Top, new Vector(0, 1, 0), Plane.YZ],
    [ViewportMode.Front, new Vector(0, -1, 0), Plane.XY],
    [ViewportMode.Front, new Vector(0, 0, -1), Plane.XZ],
]

data.forEach(([mode, vector, result]) =>
    test(`${mode} ${vector} results in expected plane ${JSON.stringify(result)}`, () => {

        const interaction = new ClippingPlaneInteraction()
        const viewportEvent = { view_mode: mode } as ViewportEvent
        interaction.set_pointer_world_location(Vector.ZERO, viewportEvent)
        interaction.pointer_click()
        interaction.set_pointer_world_location(vector, viewportEvent)
        interaction.pointer_click()
        expect(interaction.finished)
        expect(interaction.result.equals(result)).toBe(true)

    })
)
