

export function pipe<T>(...fn_list: ((t:T)=>T)[]): (t:T) => T {
    return function(t:T): T{
        for (const fn of fn_list){
            t = fn(t)
        }
        return t
    }
}
