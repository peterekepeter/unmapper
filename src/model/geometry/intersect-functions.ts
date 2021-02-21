import { Vector } from "../Vector";


export function intersect_segment_with_plane(
    segment_from: Vector,
    segment_to: Vector,
    plane_normal: Vector,
    plane_point: Vector,
    projection_bias = 0
): Vector | null {
    const sdx = segment_to.x - segment_from.x, sdy = segment_to.y - segment_from.y, sdz = segment_to.z - segment_from.z
    const slength = Math.sqrt(sdx * sdx + sdy * sdy + sdz * sdz)
    const sdirx = sdx / slength, sdiry = sdy / slength, sdirz = sdz / slength
    const sdirDotPlaneNormal = sdirx * plane_normal.x + sdiry * plane_normal.y + sdirz * plane_normal.z
    if (sdirDotPlaneNormal == 0) {
        // line is parallel to plane
        return null;
    }
    const tx = plane_point.x - segment_from.x, ty = plane_point.y - segment_from.y, tz = plane_point.z - segment_from.z
    const pointDtoPlaneNormal = tx * plane_normal.x + ty * plane_normal.y + tz * plane_normal.z
    const distance = pointDtoPlaneNormal / sdirDotPlaneNormal
    if (distance < 0 || distance > slength) {
        // intersection is outside of segment
        return null
    }
    const pd = distance + projection_bias
    const ix = segment_from.x + sdirx * pd, iy = segment_from.y + sdiry * pd, iz = segment_from.z + sdirz * pd
    return new Vector(ix, iy, iz)
}