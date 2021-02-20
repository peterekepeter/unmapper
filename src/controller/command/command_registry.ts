import { ICommandInfo } from "./ICommandInfo";
import { ICommandInfoV2 } from "./ICommandInfoV2";
import { ICommandRegistry } from "./ICommandRegistry";
    
export class CommandRegistry implements ICommandRegistry {

    command_list : ICommandInfoV2[] = [];
    
    register_command_v2(info: ICommandInfoV2): void {
        this.command_list.push(info);
    }
    
    register_commands_v2(info: ICommandInfoV2[]): void {
        this.command_list = this.command_list.concat(info)
    }

    register_command_v1(info: ICommandInfo): void {
        this.command_list.push({
            description: info.description,
            exec: (state) => {
                info.implementation();
                return state;
            },
            shortcut: info.shortcut,
            legacy_handling: true,
        });
    }
    register_commands_v1(info: ICommandInfo[]): void {
        for (const cmd of info){
            this.register_command_v1(cmd);
        }
    }
    
    get_all_commands_v2() : ICommandInfoV2[] {
        return [...this.command_list];
    }
}

export function create_command_registry() : ICommandRegistry {
    return new CommandRegistry();
}
