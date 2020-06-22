import { Vector } from "../../Vector";



export function exportVector(vector : Vector) : string {
    const x = exportComponent(vector.x);
    const y = exportComponent(vector.y);
    const z = exportComponent(vector.z);
    return `${x},${y},${z}`;
}

function exportComponent(x : number) : string {
    const sign = x < 0 ? '-' : '+';
    const absolute = Math.abs(x);
    const whole = Math.floor(absolute);
    const fract = absolute - whole;
    return sign + whole.toString().padStart(5,'0')
     + fract.toPrecision(6).substr(1).padEnd(7,'0');
}