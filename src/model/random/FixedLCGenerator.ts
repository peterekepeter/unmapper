import { RandomGeneratorCore } from "./RandomGeneratorCore"

/** generates 28 bits of randomness with relatively good distribution */
export class FixedLCGenerator implements RandomGeneratorCore {

    private state: number;
    private readonly max_state_value = 0x7fffffff // https://www.w3schools.com/js/js_bitwise.asp
    readonly range: [number, number] = [0, 0xffffff] // 28 bits of randomness

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