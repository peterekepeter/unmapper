import { fmod, UNREAL_FULL_TURN, DEGREES_FULL_TURN } from "../../ExtendedMath";

export function exportAngleDegrees(angleDegrees: number) {
    return exportInt(angleDegrees
        * UNREAL_FULL_TURN / DEGREES_FULL_TURN)
}

export function exportInt(x: number): string {
    return Math.round(x).toString();
}

export function exportFloat(x: number): string {
    return exportGenericNumeric(x, false, 0, 6, 1e-6);
}

export function exportPaddedFloat(x: number): string {
    return exportGenericNumeric(x, true, 5, 6, 1e-6);
}

export function exportGenericNumeric(
    x: number,
    alwaysShowSign: boolean,
    padLeft: number,
    padRight: number,
    precision: number): string {
    const sign = x < 0 ? '-' : alwaysShowSign ? '+' : '';
    const absolute = Math.abs(x);
    const whole = Math.floor(absolute);
    const fract = absolute - whole;
    return sign
        + whole.toString().padStart(padLeft, '0')
        + '.'
        + fract.toPrecision(6).substring(2)
            .padEnd(padRight, '0');
}