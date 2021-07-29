import { BrushModelBuilder } from "../../model/BrushModelBuilder"
import { ICommandInfoV2 } from "../../controller/command"
import { Actor } from "../../model/Actor"
import { change_actors_list } from "../../model/algorithms/editor_state_change"
import { BrushModel } from "../../model/BrushModel"
import { KnownClasses } from "../../model/KnownClasses"
import { Vector } from "../../model/Vector"

export const generate_cube_command: ICommandInfoV2 = {
    description: "Generate cube",
    shortcut: "alt + shift + c",
    exec: state => change_actors_list(state, actors => [...actors, generate_cube_actor()])
}

function generate_cube_actor(): Actor {
    const actor = new Actor()
    actor.brushModel = generate_cube_model("Model0")
    actor.className = KnownClasses.Brush
    return actor
}

function generate_cube_model(name: string): BrushModel {
    const builder = new BrushModelBuilder()
    const size = new Vector(256/4,256/2,256)
    const n = builder.next_vertex_index

    builder.set_name(name)

    for (let i=0; i<8; i++)
    {
        builder.add_vertex_coords(
            ((i & 4) - .5) * size.x,
            ((i & 2) - .5) * size.y,
            ((i & 1) - .5) * size.z,
        )
    }

    builder.add_quads([
        0, 1, 3, 2,
        2, 3, 7, 6,
        6, 7, 5, 4,
        4, 5, 1, 0,
        3, 1, 5, 7,
        0, 2, 6, 4
    ].map(i => n + i))

    return builder.build()
}