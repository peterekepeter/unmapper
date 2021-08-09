
export function filter_map<T,Y>(
    list: Iterable<T>, 
    filter_fn: (item: T, index: number) => boolean, 
    map_fn: (item: T, index: number) => Y
): Y[] {
    let index = 0
    const result: Y[] = []
    for (const item of list) {
        if (filter_fn(item, index)){
            result.push(map_fn(item, index))
        }
        index++
    }
    return result
}