export class Signal<T> {

    private _handlers: ((value: T) => void)[] = []

    constructor(private _value?:T){

    }

    set value(value: T){
        if (this._value !== value){
            this._value = value
            for (const handler of this._handlers){
                handler(this._value)
            }
        }
    }

    get value(): T{ 
        return this._value
    }
    
    subscribe(handler: (value: T) => void): { cancel: () => void } {
        this._handlers.push(handler)
        return { cancel: () => this._handlers.splice(this._handlers.indexOf(handler), 1) }
    }
}

