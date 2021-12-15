import { Actor } from "../../model/Actor"
import { DEFAULT_ACTOR_SELECTION } from "../../model/EditorSelection"
import { create_initial_editor_state, EditorState } from "../../model/EditorState"
import { load_map_from_string } from "../../model/loader"
import { Rotation } from "../../model/Rotation"
import { Scale } from "../../model/Scale"
import { change_selected_actors } from "../../model/state"
import { get_brush_polygon_vertex_uvs } from "../../model/uvmap/vertex_uv"
import { Vector } from "../../model/Vector"
import { apply_transform_command as command } from "../apply_transform"

describe("maintains vertex uv", () => {

    test("on brush without transform", () => {
        expect_maintains_uv(state => command.exec(state))
    })

    test("translated brush", () => expect_apply_transform_maintains_uv(actor => {
        actor.location = new Vector(16, 16, 16)
    }))

    test("rotated brush", () => expect_apply_transform_maintains_uv(actor => {
        actor.rotation = new Rotation(0, 90, 0)
    }))
    
    test("main scaled brush", () => expect_apply_transform_maintains_uv(actor => {
        actor.mainScale = new Scale(new Vector(2, 2, 2))
    }))

    test("post scaled brush", () => expect_apply_transform_maintains_uv(actor => {
        actor.postScale = new Scale(new Vector(2, 2, 2))
    }))

})

// eslint-disable-next-line spellcheck/spell-checker
const plane_brush = `Begin Map
Begin Actor Class=Brush Name=Brush1
    CsgOper=CSG_Add
    MainScale=(SheerAxis=SHEER_ZX)
    PostScale=(SheerAxis=SHEER_ZX)
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Brush
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    bSelected=True
    Begin Brush Name=Model2
       Begin PolyList
          Begin Polygon Item=Sheet Flags=264
             Origin   +00128.000000,+00128.000000,+00000.000000
             Normal   +00000.000000,+00000.000000,-00001.000000
             TextureU -00001.000000,+00000.000000,+00000.000000
             TextureV +00000.000000,+00001.000000,+00000.000000
             Vertex   +00128.000000,+00128.000000,+00000.000000
             Vertex   +00128.000000,-00128.000000,+00000.000000
             Vertex   -00128.000000,-00128.000000,+00000.000000
             Vertex   -00128.000000,+00128.000000,+00000.000000
          End Polygon
       End PolyList
    End Brush
    Brush=Model'MyLevel.Model2'
    Name=Brush1
End Actor
End Map
`

function expect_apply_transform_maintains_uv(mutate_actor_fn: (a: Actor) => void){
    expect_maintains_uv(state => {
        state = change_selected_actors(state, a => {
            const actor = a.shallow_copy()
            mutate_actor_fn(actor)
            return actor
        })
        return command.exec(state)
    })
}

export function expect_maintains_uv(fn: (state:EditorState) => EditorState): void {
    const state : EditorState = {
        ...create_initial_editor_state(),
        map: load_map_from_string(plane_brush), 
        selection: {
            actors: [
                {
                    ...DEFAULT_ACTOR_SELECTION,
                    actor_index: 0,
                },
            ],
        },
    }

    const initial_uvs = get_brush_polygon_vertex_uvs(state.map.actors[0].brushModel, 0)
    const next_state = fn(state)
    const next_uvs = get_brush_polygon_vertex_uvs(next_state.map.actors[0].brushModel, 0)

    expect(next_uvs).toEqual(initial_uvs)
}
