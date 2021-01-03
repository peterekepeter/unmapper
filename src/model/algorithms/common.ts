import { Actor } from "../Actor";
import { BrushModel } from "../BrushModel";
import { BrushVertex } from "../BrushVertex";
import { EditorState } from "../EditorState";
import { UnrealMap } from "../UnrealMap";

export function select_actors(state: EditorState, filter: (actor: Actor) => boolean): EditorState
{
    return change_actors(state, a => {
        const shouldBeSelected = filter(a);
        if (a.selected === shouldBeSelected){
            return a;
        } else {
            const next = a.shallowCopy();
            next.selected = shouldBeSelected;
            return next;
        }
    })
}

export function select_actors_list(actors: Actor[], filter: (actor : Actor) => boolean): Actor[]
{
    let change = false;
    const new_actors = actors.map(a => {
        const shouldBeSelected = filter(a);
        change = change || a.selected !== shouldBeSelected;
        if (a.selected === shouldBeSelected){
            return a;
        } else {
            const next = a.shallowCopy();
            next.selected = shouldBeSelected;
            return next;
        }
    });
    return change ? new_actors : actors;
}

export const change_selected_brushes = (
    state: EditorState,
    brush_fn: (b: BrushModel) => BrushModel
) : EditorState => change_selected_actors(state, actor => {
    if (!actor.brushModel){
        return actor;
    }
    const new_brush = brush_fn(actor.brushModel);
    if (!new_brush){
        throw new Error('unexpected null brush result');
    }
    if (new_brush === actor.brushModel){
        return actor;
    } else {
        const new_actor = actor.shallowCopy();
        new_actor.brushModel = new_brush;
        return new_actor;
    }
})

export const change_selected_actors = (
    state: EditorState, 
    actor_fn: (a:Actor) => Actor
): EditorState => change_actors(state, 
    actor => actor.selected ? actor_fn(actor) : actor
);

export function change_actors(state: EditorState, actor_fn: (a:Actor) => Actor){
    return change_actors_list(state, actor_list => {
        let has_change = false;
        let new_list = [];
        for (const actor of actor_list){
            const new_actor = actor_fn(actor);
            if (!new_actor){
                throw new Error('unexpected null actor result');
            }
            if (new_actor !== actor){
                has_change = true;
            }
            new_list.push(new_actor);
        }
        if (has_change){
            return new_list;
        }
        return actor_list;
    })
}

export function change_actors_list(state: EditorState, actor_list_fn: (a: Actor[]) => Actor[]): EditorState {
    return change_map(state, map => {
        const new_actors = actor_list_fn(state.map.actors);
        if (new_actors === state.map.actors){
            return map;
        }
        const next_map = new UnrealMap();
        next_map.actors = new_actors;
        return next_map;
    });
}

export function change_map(state: EditorState, map_fn: (map: UnrealMap) => UnrealMap) : EditorState {
    const next_map = map_fn(state.map);
    if (next_map === state.map){
        return state;
    }
    const next_state = {...state};
    next_state.map = next_map;
    return next_state;
}