import { Vector } from "../Vector"

export function distance_2d_to_point(x0: number, y0: number, x1: number, y1: number): number {
    const dx = x1 - x0
    const dy = y1 - y0
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance
}

export function distance_to_point(from: Vector, to: Vector): number {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dz = to.z - from.z
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
    return distance
}

export function distance_to_line_segment(
    px: number, py: number,
    ax: number, ay: number,
    bx: number, by: number
): number {
    const pax = px - ax, pay = py - ay
    const bax = bx - ax, bay = by - ay
    const h = Math.min(1.0, Math.max(0.0,
        (pax * bax + pay * bay) / (bax * bax + bay * bay)))
    const dx = pax - bax * h
    const dy = pay - bay * h
    return Math.sqrt(dx * dx + dy * dy)
}
