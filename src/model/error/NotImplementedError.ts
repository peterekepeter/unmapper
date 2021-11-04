import { ImplementationError } from "./ImplementationError"

/**
 * an error type which gets reported to users of the editor
 * use this to signal errors due to bad user inputs
 */
export class NotImplementedError extends ImplementationError {
    constructor(message = "not implemented") {
        super(message) // (1)
    }

    static cast(obj: unknown): NotImplementedError {
        if (obj instanceof NotImplementedError) {
            return obj as NotImplementedError
        }
        return null
    }

    static if(condition: boolean, message: string | (() => string) = "unexpected error"): void {
        if (condition) {
            if (typeof message === "function") {
                message = message()
            }
            throw new NotImplementedError(message)
        }
    }
}
