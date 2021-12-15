import { Actor } from "../../model/Actor"
import { Rotation } from "../../model/Rotation"
import { Scale } from "../../model/Scale"
import { change_selected_actors } from "../../model/state"
import { Vector } from "../../model/Vector"
import { recalculate_brush_center_command } from "../recalculate_brush_center"
import { expect_maintains_uv } from "./apply_transform.test"

describe("maintains vertex uv", () => {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("default case", () => expect_recalculate_maintains_uv(() => {}))

    test("translated brush", () => expect_recalculate_maintains_uv(actor => {
        actor.location = new Vector(16, 16, 16)
    }))

    test("rotated brush", () => expect_recalculate_maintains_uv(actor => {
        actor.rotation = new Rotation(0, 90, 0)
    }))
    
    test("main scaled brush", () => expect_recalculate_maintains_uv(actor => {
        actor.mainScale = new Scale(new Vector(2, 2, 2))
    }))

    test("post scaled brush", () => expect_recalculate_maintains_uv(actor => {
        actor.postScale = new Scale(new Vector(2, 2, 2))
    }))

})

function expect_recalculate_maintains_uv(mutate_actor_fn: (actor: Actor) => void): void {
    expect_maintains_uv(state => {
        state = change_selected_actors(state, a => {
            const actor = a.shallow_copy()
            mutate_actor_fn(actor)
            return actor
        })
        return recalculate_brush_center_command.exec(state)
    })
}
