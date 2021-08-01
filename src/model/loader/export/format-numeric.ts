import { UNREAL_FULL_TURN, DEGREES_FULL_TURN } from "../../ExtendedMath"

export function format_angle(angleDegrees: number): string {
    return format_int(angleDegrees
        * UNREAL_FULL_TURN / DEGREES_FULL_TURN)
}

export function format_int(x: number): string {
    return Math.round(x).toString()
}

export function format_float(x: number): string {
    return format_numeric(x, false, 0, 6, 6)
}

export function format_padded_float(x: number): string {
    return format_numeric(x, true, 5, 6, 6)
}

function format_numeric(
    x: number,
    alwaysShowSign: boolean,
    padLeft: number,
    padRight: number,
    precision: number): string {
    const sign = x < 0 ? '-' : alwaysShowSign ? '+' : ''
    const power = Math.pow(10, precision)
    const absolute = Math.abs(x) * power
    const rounded = Math.round(absolute)
    const string = rounded.toString()
    const digits = string.length
    const whole = string.substr(0, digits - precision).padStart(padLeft,'0')
    const fract = string.substr(digits - precision).padEnd(padRight, '0')
    return `${sign}${whole}.${fract}`
}