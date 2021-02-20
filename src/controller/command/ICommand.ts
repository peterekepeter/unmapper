import { ISignal } from "reactive-signals";
import { EditorState } from "../../model/EditorState";


export interface ICommand
{
    () : void | Promise<void>
    canExecute? : ISignal<boolean>
}

export type ICommandV2 = (state: EditorState, ...args: unknown[]) => EditorState;