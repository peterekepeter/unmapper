import { ISignal } from "reactive-signals";
import { EditorState } from "../model/EditorState";


// TODO:
// commands should return next state
// history pushed if state is changed by command

export interface ICommand
{
    () : void | Promise<void>
    canExecute? : ISignal<boolean>
}

export interface ICommandV2
{
    (state: EditorState, ...args: any): EditorState | Promise<EditorState>
}