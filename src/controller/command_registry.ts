import { ICommand, ICommandV2 } from "./ICommand";
    
export interface ICommandInfo 
{
    description?: string,
    implementation?: ICommand,
    shortcut?: string 
}

export interface ICommandInfoV2
{
    description?: string,
    exec?: ICommandV2,
    shortcut?: string,
    /** old commands don't return new state */
    legacy_handling?: boolean
}

export interface ICommandRegistry
{
    registerCommand(info: ICommandInfo) : void; 
    registerCommands(info: ICommandInfo[]) : void;
    register_commands_v2(info: ICommandInfoV2[]) : void;
    register_command_v2(info: ICommandInfoV2) : void;
    get_all_commands_v2() : ICommandInfoV2[];
}

export function create_command_registry() : ICommandRegistry {

    let command_list : ICommandInfoV2[] = [];

    function register_command_v2(info: ICommandInfoV2){
        command_list.push(info);
    }
    
    function register_commands_v2(info: ICommandInfoV2[]){
        command_list = command_list.concat(info)
    }
    
    function registerCommand(info: ICommandInfo){
        command_list.push({
            description: info.description,
            exec: (state) => {
                info.implementation();
                return state;
            },
            shortcut: info.shortcut,
            legacy_handling: true,
        });
    }
    
    function registerCommands(info: ICommandInfo[]){
        for (const cmd of info){
            registerCommand(cmd);
        }
    }
    
    function get_all_commands_v2() : ICommandInfoV2[] {
        return [...command_list];
    }

    return { 
        registerCommand, 
        registerCommands,
        register_command_v2,
        register_commands_v2,
        get_all_commands_v2
    }
}
