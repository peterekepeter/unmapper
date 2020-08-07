import { ISignal } from "reactive-signals";


export interface ICommand
{
    () : void | Promise<void>
    canExecute? : ISignal<boolean>
}