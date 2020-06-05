
declare module 'reactive-signals'

{
/** 
 * Creates a signal which can be read, written,
 * event handlers can be added which are called on changes.
 * 
 * Example:
 * 
 *      const currentUser = createSignal();
 *     
 *      currentUser.event(user => 
 *          user.admin ? showAdminPanel() : hideAdminPanel());
 * 
 *      // event handler gets called
 *      currentUser = { id: 13, admin: true };
 *      
 */
export function createSignal<T>(initialValue? : T, options? : ISignalOptions<T>) : ISignal<T>;


export interface ISignalOptions<T> {

    /** is used to compare previous and next values, 
     * if equal then event is not dispatched */
    equals? : (a : T, b : T) => boolean,

    /** allows transformation of signal value, input or inputs */
    transform? : (value: any | any[]) => any,

    /** use another signal as input for this signal,
     * useful when combined with transform
     */
    input? : ISignal<any>,

    /** used to read multiple signals and to combine them to a single
     * signal which dispatches an update when any input updates
     */
    inputs? : ISignal<any>[],

    /** delays signal processing by the given number of milliseconds,
     * after delay time has passed, the latest value is processed,
     * useful for throttling computation
     */
    delay? : number,

    /** if true then event handlers are awaited before retriggered,
     * if value changes while the handler does not finish, the event
     * handler is retriggered with the latest value, useful for throttling
     * I/O operations, or other high cost operations
     */
    awaitListeners? : boolean,

    /** called when first the signal gets it's first ever subscribe
     * useful for delaying oprations until sombody actually subscribes 
     * to the object
     */
    onFirstSubscribe? : () => void,

    /** called every times somebody installs an event handler */
    onSubscribe? : () => void,
}

/** 
 * Contains a value that can be read, written,
 * event handlers can be added which are called on changes.
 */
export interface ISignal<T>
{
    /** get or set the current value throught this property */
    value: T;
    
    /** reads gets the current value, same as `ISignal.value` */
    read(): T;

    /** sets the current value, same as `ISignal.value = newValue` */
    update(newValue: T) : void;

    /** adds a new change event handler to this signal */
    subscribe: (handler: (value : T) => void) => ISignalSubscription<T>;

    /** adds a new change event handler to the signal */
    event: (handler: (value : T) => void) => ISignalSubscription<T>;
}

export interface ISignalSubscription<T>
{
    cancel : () => void;
}
}