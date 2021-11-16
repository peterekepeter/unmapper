import { deep_freeze } from "../../util/deep_freeze"
import { Vector } from "../Vector"

export interface WavefrontObjSettings
{
    world_scale: number,
    uv_scale: number,
    up_axis: 'x' | 'y' | 'z',
}

export const DEFAULT_WAVEFRONT_OBJ_SETTINGS: WavefrontObjSettings = deep_freeze({
    world_scale: 1/256,
    uv_scale: 1/256,
    up_axis: 'y',
})

// reversible if applied twice
export function switch_up_axis(v: Vector, s: WavefrontObjSettings) : Vector {
    if (s.up_axis === 'z'){
        return v
    }
    if (s.up_axis === 'y'){
        return new Vector(v.x, v.z, v.y)
    }
    if (s.up_axis === 'x'){
        return new Vector(v.z, v.y, v.x)
    }
}
