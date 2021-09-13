import { ICommandInfoV2 } from "../controller/command"
import { FromTo, FromToInteraction } from "../controller/interactions/FromToInteraction"
import { LocationInteraction } from "../controller/interactions/LocationInteraction"
import { get_world_to_actor_transform } from "../model/geometry/actor-space-transform"
import { change_selected_actors, change_selected_brushes, change_selected_vertexes } from "../model/state"
import { Vector } from "../model/Vector"

export const scale_command: ICommandInfoV2 = {
    description: 'Scale objects or vertexes',
    shortcut: 's',
    args: [
        {
            name: "Pivot",
            default_value: Vector.ZERO,
            interaction_factory: LocationInteraction.factory,
        },
        {
            name: "Scale from to",
            interaction_factory: FromToInteraction.factory,
            example_values: [
                new FromTo(new Vector(1, 0, 0), new Vector(2, 0, 0)), // upscale
                new FromTo(new Vector(2, 0, 0), new Vector(1, 0, 0)), // downscale
                new FromTo(new Vector(1, 0, 0), new Vector(1, 0, 0)), // no change
            ],
        },
    ],
    exec: (state, pivot: Vector, scale: FromTo) => {
        if (!scale || !scale.from || !scale.to || scale.from === scale.to){
            return state
        }
        if (!pivot){
            pivot = Vector.ZERO
        }

        const scaling_factor = scale.to.subtract_vector(pivot).length() 
            / scale.from.subtract_vector(pivot).length()

        return state.options.vertex_mode ? change_selected_brushes(state, (b, a, s) => {

            const transform_fn = get_world_to_actor_transform(a)
            const actor_pivot = transform_fn(pivot)
            return change_selected_vertexes(b, s.vertexes, v => v
                .subtract_vector(actor_pivot)
                .scale(scaling_factor)
                .add_vector(actor_pivot))

        }) : change_selected_actors(state, old => {

            const new_location = old.location
                .subtract_vector(pivot)
                .scale(scaling_factor)
                .add_vector(pivot)
            const new_actor = old.shallow_copy()
            new_actor.location = new_location
            if (old.brushModel) {
                const new_component_scaling = Vector.ONES.scale(scaling_factor)
                new_actor.postScale = old.postScale.with_scale_vector(new_component_scaling)
            } else {
                // scale object
            }
            return new_actor
        })
    },
}
