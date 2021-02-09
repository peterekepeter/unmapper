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

// eslint-disable-next-line no-unused-vars
export type ICommandV2 = (state: EditorState, ...args: unknown[]) => EditorState;