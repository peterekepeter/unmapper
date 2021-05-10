
export interface RandomGeneratorCore
{
    readonly range: [number, number]
    seed: number
    generate_next_value(): number
}