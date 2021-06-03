/**
 * an error type which gets reported to users of the editor
 * use this to signal errors due to bad user inputs
 */
export class EditorError extends Error
{
    constructor(message : string) {
        super(message) // (1)
        this.name = EditorError.NAME // (2)
    }

    static NAME = "EditorError";

    static cast(obj : unknown) : EditorError {
        if (obj instanceof EditorError){
            return obj as EditorError
        }
        return null
    }

    static if(condition: boolean, message: string | (() => string) = "unexpected error") : void {
        if (condition){
            if (typeof message === "function"){
                message = message()
            }
            throw new EditorError(message)
        }
    }
}