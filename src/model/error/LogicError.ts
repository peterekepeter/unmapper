/**
 * an error type which gets reported to users of the editor
 * use this to signal errors due to bad user inputs
 */
export class LogicError extends Error {
    constructor(message: string) {
        super(message) // (1)
    }

    static cast(obj: unknown): LogicError {
        if (obj instanceof LogicError) {
            return obj as LogicError
        }
        return null
    }

    static if(condition: boolean, message: string | (() => string) = "unexpected error"): void {
        if (condition) {
            if (typeof message === "function") {
                message = message()
            }
            throw new LogicError(message)
        }
    }
}