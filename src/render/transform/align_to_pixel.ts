import { Vector } from "../../model/Vector";
import { align_to_grid } from "../../model/algorithms/alignToGrid";

export function nice_round(scale: number): number {
    var log = Math.log2(scale) - 2;
    log = Math.round(log)
    var grid = Math.pow(2, log)
    return Math.round(scale/grid)*grid
}

export function find_nice_ratio(scale: number): [number, number] {
    scale = nice_round(scale);
    if (scale < 1) {
        return [1, 1/scale];
    }
    else {
        return [scale, 1];
    }
}

export function align_2d_view_to_pixels(v: { device_size: number, width: number, height: number, scale: number, view_center:Vector }){
    if (isNaN(v.device_size)) {
        return;
    }
    v.height = v.height & 0xfffffe;
    v.width = v.width & 0xfffffe;
    v.device_size = nice_round(v.device_size);
    v.scale = nice_round(v.scale);
    const alingtoscale = 1 / (v.device_size * v.scale);
    const halfpixel = alingtoscale*0.5;
    v.view_center = align_to_grid(v.view_center, Vector.ONES.scale(alingtoscale)).add_numbers(halfpixel,halfpixel,halfpixel);
}
