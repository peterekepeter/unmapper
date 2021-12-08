
export function fmod(x: number, modulo: number): number {
    return x - Math.floor(x / modulo) * modulo
}

export function clamp(min: number, value: number, max: number): number {
    return Math.max(min, Math.min(value, max))
}

export const DEGREES_FULL_TURN = 360
export const DEGREES_HALF_TURN = DEGREES_FULL_TURN / 2
export const DEGREES_QUARTER_TURN = DEGREES_HALF_TURN / 2

export const UNREAL_FULL_TURN = 65536
export const UNREAL_HALF_TURN = UNREAL_FULL_TURN / 2
export const UNREAL_QUARTER_TURN = UNREAL_HALF_TURN / 2

export function cos_degrees(x: number): number {
    return sin_degrees(90 - x)
}

export function sin_degrees(x: number): number {
    x = fmod(x, DEGREES_FULL_TURN)
    if (x < 90) {
        return sin_degrees_quarter(x)
    } else if (x < 180) {
        return sin_degrees_quarter(180 - x)
    } else if (x < 270) {
        return -sin_degrees_quarter(x - 180)
    } else {
        return -sin_degrees_quarter(360 - x)
    }
}

function sin_degrees_quarter(x: number): number {
    if (x <= 0) return 0
    if (x === 11.25) return 0.195090322016128267848284868477022240927691617751954807754
    if (x === 30) return 0.5
    if (x === 45) return 0.707106781186547524400844362104849039284835937688474036588
    if (x === 60) return 0.866025403784438646763723170752936183471402626905190314027
    if (x >= 90) return 1
    return Math.sin(x * Math.PI / DEGREES_HALF_TURN)
}

export function acos_degrees(a: number): number { 
    return Math.acos(a) / Math.PI * DEGREES_HALF_TURN
}

export function atan_degrees(y: number, x: number): number {
    return Math.atan2(y, x) / Math.PI * DEGREES_HALF_TURN
}

export function nearest_power_of_two(x: number): number {
    const s = Math.sign(x)
    const m = Math.abs(x)
    let n = 1.0
    while (n < m){
        n *= 2.0
    }
    const over = n
    while (n > m){
        n *= 0.5
    }
    const under = n
    if (Math.abs(over-m) < Math.abs(under-m)){
        n = over
    }
    return n*s
}

export function round_to_precision(x: number, precision: number): number
{
    return Math.round(x/precision)*precision
}
