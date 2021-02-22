import { Vector } from "../../model/Vector";
import { VectorInputInteraction } from "./VectorInputInteraction"


test('initially interaction is not finished', () => {
    const interaction = new VectorInputInteraction()
    expect(interaction.finished).toBe(false)
})

test('after first pointer click interaction is not finished', () => {
    const interaction = new VectorInputInteraction()
    interaction.set_pointer_world_location(new Vector(10,10,10))
    interaction.pointer_click()
    expect(interaction.finished).toBe(false)
})

test('before first click result equals zero vector', () => {
    const interaction = new VectorInputInteraction()
    interaction.set_pointer_world_location(new Vector(10,10,10))
    interaction.set_pointer_world_location(new Vector(14,14,14))
    expect(interaction.result).toEqual(Vector.ZERO)
})

test('after first click result starts having a vector', () => {
    const interaction = new VectorInputInteraction()
    interaction.set_pointer_world_location(new Vector(10,10,10))
    interaction.pointer_click()
    interaction.set_pointer_world_location(new Vector(11,12,13))
    expect(interaction.result).toEqual(new Vector(1,2,3))
})

test('after second click interaction is finished and has correct result', () => {
    const interaction = new VectorInputInteraction()
    interaction.set_pointer_world_location(new Vector(10,10,10))
    interaction.pointer_click()
    interaction.set_pointer_world_location(new Vector(11,12,13))
    interaction.pointer_click()
    expect(interaction.finished).toBe(true)
    expect(interaction.result).toEqual(new Vector(1,2,3))
})