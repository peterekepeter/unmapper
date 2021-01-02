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
    implementation?: ICommandV2,
    shortcut?: string
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

    let commandList : ICommandInfoV2[] = [];

    function register_command_v2(info: ICommandInfoV2){
        commandList.push(info);
    }
    
    function register_commands_v2(info: ICommandInfoV2[]){
        commandList = commandList.concat(info)
    }
    
    function registerCommand(info: ICommandInfo){
        commandList.push({
            description: info.description,
            implementation: async (state) => {
                await info.implementation();
                return state;
            },
            shortcut: info.shortcut
        });
    }
    
    function registerCommands(info: ICommandInfo[]){
        for (const cmd of info){
            registerCommand(cmd);
        }
    }
    
    function get_all_commands_v2() : ICommandInfoV2[] {
        return [...commandList];
    }

    return { 
        registerCommand, 
        registerCommands,
        register_command_v2,
        register_commands_v2,
        get_all_commands_v2
    }
}
