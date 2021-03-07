import { PivotRotation } from "../../model/PivotRotation"
import { Rotation } from "../../model/Rotation"
import { Vector } from "../../model/Vector"
import { ViewportMode } from "../../model/ViewportMode"
import { RotationInputInteraction as RotationInteraction } from "./RotationInputInteraction"

let interaction : RotationInteraction

beforeEach(() => interaction = new RotationInteraction())

test('rotate 90 degrees', () => {
    interaction.set_pointer_world_location(new Vector(0,0,0), ViewportMode.Top)
    interaction.pointer_click()
    interaction.set_pointer_world_location(new Vector(1,0,0), ViewportMode.Top)
    interaction.pointer_click()
    interaction.set_pointer_world_location(new Vector(0,1,0), ViewportMode.Top)
    interaction.pointer_click()
    const expected = new PivotRotation(Vector.ZERO, new Rotation(0,90,0))
    expect(interaction.result).toEqual(expected)
})

test('rotate 90 degrees with pivot', () => {
    interaction.set_pointer_world_location(new Vector(1,1,1), ViewportMode.Top)
    interaction.pointer_click()
    interaction.set_pointer_world_location(new Vector(2,1,1), ViewportMode.Top)
    interaction.pointer_click()
    interaction.set_pointer_world_location(new Vector(1,2,1), ViewportMode.Top)
    interaction.pointer_click()
    const expected = new PivotRotation(new Vector(1,1,1), new Rotation(0,90,0))
    expect(interaction.result).toEqual(expected)
})
