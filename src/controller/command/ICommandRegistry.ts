import { ICommandInfo } from "./ICommandInfo";
import { ICommandInfoV2 } from "./ICommandInfoV2";


export interface ICommandRegistry {
    register_command_v1(info: ICommandInfo): void;
    register_commands_v1(info: ICommandInfo[]): void;
    register_command_v2(info: ICommandInfoV2): void;
    register_commands_v2(info: ICommandInfoV2[]): void;
    get_all_commands_v2(): ICommandInfoV2[];
}
