
export interface RandomGeneratorCore
{
    readonly min_value_inclusive: 0
    readonly max_value_exclusive: number
    seed: number
    generate_next_value(): number
}