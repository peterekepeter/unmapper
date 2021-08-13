import { ICommandInfoV2 } from "../controller/command"
import { BrushVertex } from "../model/BrushVertex"
import { EditorError } from "../model/error/EditorError"
import { get_actor_to_world_transform } from "../model/geometry/actor-space-transform"
import { Rotation } from "../model/Rotation"
import { Scale } from "../model/Scale"
import { change_selected_actors } from "../model/state"
import { Vector } from "../model/Vector"

export const apply_transform_command: ICommandInfoV2 = {

    description: "Apply object transformation to brush vertexes",

    exec: state => change_selected_actors(state, old_actor => {
        const transform_fn = get_actor_to_world_transform(old_actor)
        if (state.options.vertex_mode) { throw new EditorError('does not work in vertex mode') }
        if (transform_fn(Vector.ZERO) === Vector.ZERO &&
            transform_fn(Vector.ONES) === Vector.ONES) {
            return old_actor // identity transform detected
        }
        const old_brush = old_actor.brushModel
        const new_brush = old_brush.shallow_copy()
        new_brush.vertexes = old_brush.vertexes.map(v =>
            new BrushVertex(transform_fn(v.position)))
        const new_actor = old_actor.shallow_copy()
        new_actor.rotation = Rotation.IDENTITY
        new_actor.mainScale = Scale.DEFAULT_SCALE
        new_actor.postScale = Scale.DEFAULT_SCALE
        new_actor.location = Vector.ZERO
        new_actor.oldLocation = null
        new_actor.prePivot = null
        new_actor.brushModel = new_brush
        return new_actor
    })

}