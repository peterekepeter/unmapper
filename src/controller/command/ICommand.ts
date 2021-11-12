import { EditorState } from "../../model/EditorState"
import { Signal } from "../../util/Signal"

export interface ICommand
{
    () : void | Promise<void>
    canExecute? : Signal<boolean>
}

export type ICommandV2 = (state: EditorState, ...args: unknown[]) => EditorState;

export type AsyncCommand = (merge_fn: StateMergeFn) => PromiseLike<void>

export type StateMergeFn = (callback: (state: EditorState) => EditorState) => void;
