import { ISignal } from "reactive-signals";


export interface ICommand
{
    execute() : void
    canExecute : ISignal<boolean>
}