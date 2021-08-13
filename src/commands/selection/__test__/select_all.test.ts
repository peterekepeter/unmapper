import { Actor } from '../../../model/Actor'
import { BrushModelBuilder } from '../../../model/BrushModelBuilder'
import { create_actor_selection } from '../../../model/EditorSelection'
import { editor_state_from_actors } from '../../../model/EditorState'
import { is_null_or_empty } from '../../../util/is_null_or_empty'
import { select_all_command as command } from '../select_all'


describe('select all actors', () =>{

    const actor_0 = new Actor()
    const actor_1 = new Actor()
    const current_state = editor_state_from_actors([actor_0, actor_1])
    const next_state = command.exec(current_state)
    
    test('next_state actors are selected', () => 
        expect(next_state.selection.actors.map(a => a.actor_index)).toEqual([0,1]))

    test('current_state actors are not selected', () => 
        expect(is_null_or_empty(current_state.selection.actors)).toBe(true))

})

describe('select all vertexes', () => {

    const actor_0 = new Actor()
    const actor_1 = new Actor()
    const builder = new BrushModelBuilder()
    builder.add_vertex_coords(0,3,14)
    const brush = builder.build()
    actor_0.brushModel = brush
    actor_1.brushModel = brush
    const current_state = editor_state_from_actors([actor_0, actor_1])
    current_state.options.vertex_mode = true
    current_state.selection = { actors: [ create_actor_selection(1) ] }
    const next_state = command.exec(current_state)

    test('current_state vertexes of selected actor are not selected', () =>{
        expect(current_state.selection.actors).toHaveLength(1)
        expect(is_null_or_empty(current_state.selection.actors[0].vertexes)).toBe(true)
    })

    test('next_state vertexes of selected actor are selected', () => {
        expect(next_state.selection.actors).toHaveLength(1)
        expect(next_state.selection.actors[0].vertexes).toHaveLength(1)
    })

})