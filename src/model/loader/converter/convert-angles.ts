import { DEGREES_FULL_TURN, UNREAL_FULL_TURN } from "../../ExtendedMath";


export function unrealAngleToDegrees(unrealAngle : number) : number {
    return unrealAngle * DEGREES_FULL_TURN / UNREAL_FULL_TURN;
}

export function degreesToUnrealAngle(degrees : number) : number {
    return degrees / DEGREES_FULL_TURN * UNREAL_FULL_TURN;
}