import { ICommand } from "./ICommand";

let commandList : ICommandInfo[] = [];

export function registerCommand(info: ICommandInfo){
    commandList.push(info);
}

export function registerCommands(info: ICommandInfo[]){
    commandList = commandList.concat(info)
}

export interface ICommandInfo 
{
    description?: string,
    implementation?: ICommand,
    shortcut?: string 
}

export function getAllCommands(){
    return commandList;
}