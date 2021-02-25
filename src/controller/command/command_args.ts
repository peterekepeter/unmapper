import { ICommandInfoV2 } from ".";


export function get_default_args(command: ICommandInfoV2) : unknown[] {
    if (!command.args){
        return []
    }
    return command.args.map((arg, i) => get_default_arg(command, i))
}

export function get_default_arg(command: ICommandInfoV2, index: number) : unknown {
    const arg = command.args[index]
    return arg.default_value ?? 
        (arg.example_values && arg.example_values.length > 0 ? arg.example_values[0] : undefined)
}