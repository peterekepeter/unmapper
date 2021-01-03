/**
 * an error type which gets reported to users of the editor
 * use this to signal errors due to bad user inputs
 */
export class EditorError extends Error
{
    constructor(message : string) {
        super(message); // (1)
        this.name = EditorError.NAME; // (2)
    }

    static NAME = "EditorError";

    static cast(obj : any) : EditorError {
        if (obj.name === EditorError.NAME){
            return obj as EditorError;
        }
        return null;
    }
}