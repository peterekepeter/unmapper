import { ICommand } from "./ICommand";


export interface ICommandInfo {
    description?: string;
    implementation?: ICommand;
    shortcut?: string;
}
