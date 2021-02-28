import { Actor } from "../../Actor"
import { Rotation } from "../../Rotation";
import { Scale } from "../../Scale";
import { Vector } from "../../Vector"
import { get_actor_to_world_transform, get_actor_to_world_transform_optimized, get_actor_to_world_transform_simple } from "../actor-space-transform"


describe('get_actor_to_world_transform', () => {

    describe('default actor has identity transform', () => {

        const fn = get_actor_to_world_transform(new Actor());

        [Vector.UP, Vector.ZERO, Vector.ONES]
            .forEach(v => test(`fn(${v})=${v}`, () =>
                expect(fn(v)).toEqual(v)));

        [Vector.UP, Vector.ZERO, Vector.ONES]
            .forEach(v => test(`fn(${v}) reference_equals input`, () =>
                expect(fn(v)).toBe(v)))
    })

    describe('transform consistency', () => {

        const defaultActor = new Actor()

        const withPivot = new Actor()
        withPivot.prePivot = new Vector(14, 543, 3)

        const withLocation = new Actor()
        withLocation.location = new Vector(99, 22, 11)

        const withRotation = new Actor()
        withRotation.rotation = new Rotation(90, 45, 10)

        const withPivotRotation = withRotation.shallow_copy()
        withPivotRotation.prePivot = new Vector(14, 543, 3)

        const withRotationLocation = withRotation.shallow_copy()
        withRotationLocation.location = new Vector(99, 22, 11)

        const withUniformMainScale = new Actor()
        withUniformMainScale.mainScale = new Scale(new Vector(2, 2, 2))

        const withNonUniformMainScale = new Actor()
        withNonUniformMainScale.mainScale = new Scale(new Vector(2, 13, 9))

        const withPostScale = new Actor()
        withPostScale.postScale = new Scale(new Vector(2, 2, 2))

        const withUniformMainScalePivot = withUniformMainScale.shallow_copy()
        withUniformMainScalePivot.prePivot = new Vector(14, 543, 3)

        const withNonUniformMainScaleLocation = withNonUniformMainScale.shallow_copy()
        withNonUniformMainScaleLocation.location = new Vector(99, 22, 11)

        const actors: { [key: string]: Actor } = {
            defaultActor,
            withPivot,
            withLocation,
            withRotation,
            withPivotRotation,
            withRotationLocation,
            withUniformMainScale,
            withNonUniformMainScale,
            withPostScale,
            withUniformMainScalePivot,
            withNonUniformMainScaleLocation
        }

        const vectors = [
            Vector.ZERO,
            Vector.ONES,
            Vector.UP,
            Vector.RIGHT,
            Vector.FORWARD
        ]

        for (const key in actors) {
            const actor = actors[key]
            describe(`for actor with ${key}`, () => {
                const optimized_fn = get_actor_to_world_transform_optimized(actor)
                const simple_fn = get_actor_to_world_transform_simple(actor)
                for (const vector of vectors) {
                    test(`optimization is stable for ${JSON.stringify(vector)}`, () => {
                        expect(optimized_fn(vector)).toEqual(simple_fn(vector))
                    })
                }
            })
        }
    })
})
