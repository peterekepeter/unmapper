import { BrushModel } from "../BrushModel";

export function shuffle_brush_polygons(brush : BrushModel) : BrushModel{
    const newBrush = brush.shallowCopy();
    newBrush.polygons = shuffle(newBrush.polygons);
    return newBrush;
}

export function shuffle<T>(list: T[]) : T[]
{
    if (list.length <= 1){
        return list;
    }
    const result : T[] = [...list];
    for (let i=0; i<result.length; i++){
        const a = Math.floor(Math.random()*result.length);
        const b = Math.floor(Math.random()*result.length);
        const t = result[a];
        result[a] = result[b];
        result[b] = t;
    }
    return result;
}
