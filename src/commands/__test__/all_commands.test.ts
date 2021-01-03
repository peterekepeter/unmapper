import { get_all_commands_v2 } from "..";
import { ICommandInfoV2 } from "../../controller/command_registry";
import { EditorError } from "../../model/EditorError";
import { EditorState, editor_state_from_actors } from "../../model/EditorState";

/**
 * all commands must pass a few tests to make sure they don't wreck the whole system
 */
const all_commands = get_all_commands_v2();

/**
 * each command is ran agains a list of test editor states which are built here
 */
function build_test_states(){
    const state = editor_state_from_actors([]);
    state.vertex_mode = false;
    
    const state_vertex_mode = editor_state_from_actors([])
    state_vertex_mode.vertex_mode = true;
    
    return [
        {
            state: state,
            description: 'normal state',
        },
        {
            state: state_vertex_mode,
            description: 'vertex mode state',
            serialized: JSON.stringify(state)
        }
    ]
}

all_commands.forEach(command => describe(format_label(command), () => {

    build_test_states().forEach(test_state => describe(test_state.description, () => {

        const initial_json = JSON.stringify(test_state.state);
        let next_state : EditorState;
        let caught_error : any;
        let success: boolean = null;

        beforeAll(async () =>{
            try {
                next_state = await command.implementation(test_state.state);
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
                expect(EditorError.cast(caught_error)).not.toBeNull();
            }
        });

        test('input not modified', () => {
            // in any case input must not be modified!!
            expect(JSON.stringify(test_state.state)).toBe(initial_json);
        })

    }))
}));

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