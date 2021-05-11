import { FixedLCGenerator } from "./FixedLCGenerator"
import { RandomGeneratorCore } from "./RandomGeneratorCore"


export class RandomNumberGenerator {

    constructor(private core: RandomGeneratorCore = new FixedLCGenerator()) { }

    set seed(value: number) { this.core.seed = value }

    next_value(): number {
        return this.core.generate_next_value()
    }

    next_int(max_value_exclusive: number): number {
        return this.core.generate_next_value() % max_value_exclusive
    }

    next_int_in_range(min_value_inclusive: number, max_value_exclusive: number): number {
        const value = this.core.generate_next_value()
        return min_value_inclusive + (value % (max_value_exclusive - min_value_inclusive))
    }
    
    next_float(): number
    {
        return this.core.generate_next_value() / this.core.max_value_exclusive
    }

    next_float_in_range(min_value_inclusive: number, max_value_exclusive: number): number
    {
        return this.next_float() * (max_value_exclusive - min_value_inclusive) + min_value_inclusive
    }

}