import { ParseError } from "./ParseError"

export class GenericParser {

    private _tokens: string[];
    private _index = 0;

    constructor (tokens:string[]) {
        this._tokens = tokens
    }

    public get_current_token() : string {
        return this._tokens[this._index]
    }

    public get_current_token_and_move_to_next() : string {
        const token = this.get_current_token()
        this.move_to_next()
        return token
    }

    public parse_float_and_move_to_next() : number {
        const token = this.get_current_token()
        this.move_to_next()
        const value = Number.parseFloat(token)
        if (isNaN(value)){
            this.error("Expected float")
        }
        return value
    }

    public parse_int_and_move_to_next() : number {
        const token = this.get_current_token()
        this.move_to_next()
        const value = Number.parseInt(token)
        if (isNaN(value)){
            this.error("Expected int")
        }
        return value
    }
    
    public move_to_next(): void {
        this._index += 1
    }

    public accept_and_move_to_next(token : string): void {
        if (this.get_current_token() !== token)
        {
            this.error(`Expecting \"${token}\"`)
        }
        this.move_to_next()
    }

    public get_relative_token(offset : number): string {
        return this._tokens[this._index + offset]
    }

    public error(message = "Unknown error"): void {
        const messageWithContext = `${message}, at token \"${this.get_current_token()}\", after \"${this.get_relative_token(-1)}\"`
        throw new ParseError(messageWithContext)
    }
}
