import { get_all_commands_v2 } from "../all_commands";
import { ICommandInfoV2 } from "../../controller/command_registry";
import { EditorError } from "../../model/EditorError";
import { EditorState, editor_state_from_actors } from "../../model/EditorState";
import { Actor } from "../../model/Actor";
import { BrushModel } from "../../model/BrushModel";
import { Vector } from "../../model/Vector";
import { createBrushPolygon } from "../../model/algorithms/createBrushPolygon";

/**
 * all commands must pass a few tests to make sure they don't wreck the whole system
 */
const all_commands = get_all_commands_v2();

/**
 * each command is ran agains a list of test editor states which are built here
 */
function build_test_states(){

    const brush = new BrushModel();
    brush.addVertex(new Vector(0,0,0), true);
    brush.addVertex(new Vector(1,0,0), true);
    brush.addVertex(new Vector(1,1,0), true);
    brush.addVertex(new Vector(0,1,0), true);
    const brushWithPoly = createBrushPolygon(brush, [0,1,2,3]);

    const actor_1 = new Actor();
    actor_1.name = 'Actor1';
    actor_1.selected = true;
    actor_1.brushModel = brushWithPoly;

    const actor_2 = new Actor();
    actor_2.name = 'Actor2';
    actor_2.selected = false;
    actor_2.brushModel = brushWithPoly;

    const state = editor_state_from_actors([actor_1, actor_2]);
    state.vertex_mode = false;
    
    const state_vertex_mode = editor_state_from_actors([actor_1, actor_2])
    state_vertex_mode.vertex_mode = true;
    
    return [
        {
            state,
            description: 'normal state',
        },
        {
            state: state_vertex_mode,
            description: 'vertex mode state'
        }
    ]
}

all_commands.forEach(command => describe(format_label(command), () => {

    build_test_states().forEach(test_state => describe(test_state.description, () => {

        const initially_serialized = serialize(test_state.state);
        let next_state : EditorState;
        let caught_error : unknown;
        let success: boolean = null;

        beforeAll(async () =>{
            try {
                next_state = await command.exec(test_state.state);
                success = true;
            }
            catch (error){
                // may or may not throw, app should handle that
                caught_error = error;
                success = false;
            }
        })

        test('valid result', () => {
            if (success)
            {
                // command result MUST be either a valid state
                validate_state(next_state);
            } 
            else 
            {
                // or MUST be an EditorError
                const casted = EditorError.cast(caught_error);
                if (casted == null){
                    console.error(caught_error);
                }
                expect(casted).not.toBeNull();
            }
        });

        test('input not modified', () => {
            // in any case input must not be modified!!
            expect(serialize(test_state.state)).toBe(initially_serialized);
        })

    }))
}));

function serialize(state: EditorState): string {
    return JSON.stringify(state, undefined, 2);
}

function validate_state(state: EditorState){
    // some basic validation checks
    expect(state).not.toBe(null);
    expect(state.map).not.toBe(null);
    expect(state.vertex_mode === true || state.vertex_mode === false).toBeTruthy();
    expect(state.map.actors).not.toBe(null);
    expect(state.map.actors.length).not.toBe(null);
}

function format_label(command : ICommandInfoV2){
    if (command.shortcut){
        return `${command.description} (${command.shortcut})`
    } else {
        return command.description;
    }
}