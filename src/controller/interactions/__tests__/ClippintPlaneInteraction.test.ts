import { Plane } from "../../../model/Plane";
import { Vector } from "../../../model/Vector";
import { ViewportEvent } from "../../../model/ViewportEvent";
import { ViewportMode } from "../../../model/ViewportMode";
import { ClippingPlaneInteraction } from "../ClippingPlaneInteraction";


const data: [ViewportMode, Vector, Plane][] = [
    [ViewportMode.Top, new Vector(-1, 0, 0), Plane.XZ],
    [ViewportMode.Top, new Vector(0, -1, 0), Plane.YZ],
    [ViewportMode.Front, new Vector(0, -1, 0), Plane.XY],
    [ViewportMode.Front, new Vector(0, 0, -1), Plane.XZ],
    [ViewportMode.Top, new Vector(1,1,0), new Plane(new Vector(-1,1,0), 0)]
]

data.forEach(([mode, vector, expected]) =>
    test(`${mode} ${vector} results in expected plane ${JSON.stringify(expected)}`, () => {

        const interaction = new ClippingPlaneInteraction()
        const viewportEvent = { view_mode: mode } as ViewportEvent
        interaction.set_pointer_world_location(Vector.ZERO, viewportEvent)
        interaction.pointer_click()
        interaction.set_pointer_world_location(vector, viewportEvent)
        interaction.pointer_click()
        expect(interaction.finished)
        expect(interaction.result.normal.with_positive_zeroes()).toEqual(expected.normal)
        expect(interaction.result.distance).toBeCloseTo(expected.distance, 10)

    })
)
