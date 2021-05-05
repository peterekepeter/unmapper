import { get_all_commands_v2 } from "../all_commands";
import { ICommandInfoV2 } from "../../controller/command";
import { EditorError } from "../../model/EditorError";
import { EditorState, editor_state_from_actors } from "../../model/EditorState";
import { Actor } from "../../model/Actor";
import { BrushModel } from "../../model/BrushModel";
import { Vector } from "../../model/Vector";
import { createBrushPolygon } from "../../model/algorithms/createBrushPolygon";
import { get_default_args } from "../../controller/command/command_args";

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
    state.options.vertex_mode = false;
    
    const state_vertex_mode = editor_state_from_actors([actor_1, actor_2])
    state_vertex_mode.options.vertex_mode = true;
    
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
    for (const [args,args_description] of iterate_args_test_cases(command)){
        describe(args_description, () => {
            build_test_states().forEach(test_state => describe(test_state.description, () => {
                command_test_case(command, test_state.state, args);
            }))
        })
    }
}));

function command_test_case(command:ICommandInfoV2, state: EditorState, args:unknown[]) {

    const initially_serialized = serialize(state);
    let next_state : EditorState;
    let caught_error : unknown;
    let success: boolean = null;

    beforeAll(async () =>{
        try {
            next_state = command.exec(state, ...args);
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
        expect(serialize(state)).toBe(initially_serialized);
    })
}


function* iterate_args_test_cases(command: ICommandInfoV2): Iterable<[unknown[], string]>{
    const args = get_default_args(command)
    yield [args, 'default args']
    if (!command.args){
        return;
    }
    for (let i=0; i<command.args.length; i++){
        const arg = command.args[i]
        if (!arg.example_values){
            continue;
        }
        const default_value = args[i]
        for (let j=0; j<arg.example_values.length; j++){
            const example_value = arg.example_values[j];
            if (example_value != default_value) {
                args[i] = example_value
                yield [args, `${arg.name??i}:${JSON.stringify(example_value)}`];
            }
        }
        args[i] = default_value
    }
}

function serialize(state: EditorState): string {
    return JSON.stringify(state, undefined, 2)
}

function validate_state(state: EditorState){
    // some basic validation checks
    expect(state).not.toBe(null);
    expect(state.map).not.toBe(null);
    expect(state.options.vertex_mode === true || state.options.vertex_mode === false).toBeTruthy();
    expect(state.map.actors).not.toBe(null);
    expect(state.map.actors.length).not.toBe(null);
    for (const actor of state.map.actors){
        if (actor.brushModel){
            validate_brush(actor.brushModel)
        }
    }
}

function validate_brush(brush: BrushModel){
    const vertex_count = brush.vertexes.length
    const edge_count = brush.edges.length
    for (const poly of brush.polygons){
        for (const vid of poly.vertexes){
            expect(vid).toBeLessThan(vertex_count)
        }
        for (const eid of poly.edges){
            expect(eid).toBeLessThan(edge_count)
        }
    }
    for (const edge of brush.edges){
        expect(edge.vertexIndexA).toBeLessThan(vertex_count)
        expect(edge.vertexIndexB).toBeLessThan(vertex_count)
    }
}

function format_label(command : ICommandInfoV2){
    if (command.shortcut){
        return `${command.description} (${command.shortcut})`
    } else {
        return command.description
    }
}