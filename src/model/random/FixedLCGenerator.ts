import { RandomGeneratorCore } from "./RandomGeneratorCore"

/** generates 28 bits of randomness with relatively good distribution */

export class FixedLCGenerator implements RandomGeneratorCore {
    readonly min_value_inclusive: 0 = 0;
    readonly max_value_exclusive: number = 0x1000000 // 28 bits of randomness

    private state: number;
    private readonly max_state_value = 0x7fffffff // https://www.w3schools.com/js/js_bitwise.asp
    readonly range: [number, number] = [this.min_value_inclusive, this.max_value_exclusive] 

    set seed(value: number) {
        this.state = value & this.max_state_value
    }

    generate_next_value(): number {
        // inspired from https://en.wikipedia.org/wiki/Linear_congruential_generator
        this.state = ((this.state - 1234567) * 134775813) & this.max_state_value
        // shave off the low values which can be destroyed by rounding errors
        // or have questionable periodicity
        return this.state >> 7
    }

}