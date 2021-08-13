export function is_null_or_empty<T>(item: Iterable<T>): boolean{
    if (item == null) return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of item){
        return false
    }
    return true
}