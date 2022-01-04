export class ImplementationError extends Error {
    constructor(message: string) {
        super(message) // (1)
    }

    static cast(obj: unknown): ImplementationError {
        if (obj instanceof ImplementationError) {
            return obj as ImplementationError
        }
        return null
    }

    static if(condition: boolean, message: string | (() => string) = "unexpected error"): void {
        if (condition) {
            if (typeof message === "function") {
                message = message()
            }
            throw new ImplementationError(message)
        }
    }

    static if_not(condition: boolean, message: string | (() => string) = "unexpected error"): void {
        ImplementationError.if(!condition, message)
    }
}
