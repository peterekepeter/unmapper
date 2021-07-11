
interface RangeGenerator{
    
    [Symbol.iterator](): Iterator<number>;
    
    map<T>(fn: (i: number) => T): T[];
    each(fn: (t: number) => void): void;
}

export function range(stop: number): RangeGenerator
export function range(start: number, stop: number): RangeGenerator
export function range(start: number, stop: number, step: number): RangeGenerator
export function range(a: number, b?: number, c?: number): RangeGenerator {
    const gen = range_generator(a,b,c)
    return {
        [Symbol.iterator]: gen[Symbol.iterator],
        each: (fn) => { for (const i of gen) fn(i) },
        map: (fn) => { const result = []; for (const i of gen) result.push(fn(i)); return result }
    }
}

function* range_generator(a: number, b?: number, c?: number): Iterable<number>{
    let start = 0, stop = 0, step = 1
    if (b == null) { // 1 arg
        stop = a
    }
    else { // 2 arg or 3 arg
        start = a
        stop = b
    }
    if (c != null) {
        step = c
    }
    for (let i = start; i < stop; i += step){
        yield i
    }
}