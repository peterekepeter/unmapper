
export class Parser {

    private _tokens: string[];
    private _index = 0;

    constructor (tokens:string[]) {
        this._tokens = tokens;
    }

    public getCurrentToken() : string {
        return this._tokens[this._index];
    }

    public getCurrentTokenAndMoveToNext() : string {
        var token = this.getCurrentToken();
        this.moveToNext();
        return token;
    }

    public parseFloatAndMoveToNext() : number {
        var token = this.getCurrentToken();
        this.moveToNext();
        const value = Number.parseFloat(token);
        if (isNaN(value)){
            this.error("Expected float");
        }
        return value;
    }
    
    public moveToNext() {
        this._index += 1;
    }

    public acceptAndMoveToNext(token : string){
        if (this.getCurrentToken() !== token)
        {
            this.error(`Expecting \"${token}\"`);
        }
        this.moveToNext();
    }

    public getRelativeToken(offset : number){
        return this._tokens[this._index + offset];
    }

    public error(message = "Unknown error"){
        const messageWithContext = `${message}, at token \"${this.getCurrentToken()}\", after \"${this.getRelativeToken(-1)}\"`;
        throw new Error(messageWithContext);
    }
}