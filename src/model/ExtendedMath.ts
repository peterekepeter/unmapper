
export function fmod(x : number, modulo : number){
    return x-Math.floor(x/modulo)*modulo;
}

export function clamp(min: number, value: number, max: number): number {
    return Math.max(min, Math.min(value, max))
}

export const DEGREES_FULL_TURN = 360;
export const DEGREES_HALF_TURN = DEGREES_FULL_TURN / 2;
export const DEGREES_QUARTER_TURN = DEGREES_HALF_TURN / 2;

export const UNREAL_FULL_TURN = 65536;
export const UNREAL_HALF_TURN = UNREAL_FULL_TURN / 2;
export const UNREAL_QUARTER_TURN = UNREAL_HALF_TURN / 2;

export function sinDegrees(x : number){
    x = fmod(x, DEGREES_FULL_TURN);
    if (x < 90){
        return sinDegreesQuarter(x);
    } else if (x < 180){
        return sinDegreesQuarter(180 - x);
    } else if (x < 270){
        return -sinDegreesQuarter(x - 180);
    } else {
        return -sinDegreesQuarter(360 - x);
    }
}

export function cosDegrees(x : number){
    return sinDegrees(90-x);
}

function sinDegreesQuarter(x : number){
    if (x <= 0) return 0;
    if (x === 11.25) return 0.195090322016128267848284868477022240927691617751954807754;
    if (x === 30) return 0.5;
    if (x === 45) return 0.707106781186547524400844362104849039284835937688474036588;
    if (x === 60) return 0.866025403784438646763723170752936183471402626905190314027;
    if (x >= 90) return 1;
    return Math.sin(x*Math.PI/180);
}
