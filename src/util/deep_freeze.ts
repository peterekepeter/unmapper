

export function deep_freeze<T>(obj: T): T
{
    if (Object.isFrozen(obj)){
        return obj
    }
    if (typeof obj === 'object'){
        for (const key in obj){
            deep_freeze(obj[key])
        }
    }
    Object.freeze(obj)
    return obj
}