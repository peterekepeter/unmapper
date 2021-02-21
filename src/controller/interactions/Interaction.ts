import { Vector } from "../../model/Vector";
import { InteractionType } from "./InteractionType";

export interface Interaction {

    handle_keydown(key: string) : void;

    handle_pointer_down() : void;

    handle_pointer_move(ray_origin: Vector, ray_direction: Vector) : void;

    // emits interaction complete
    
    // emit final value

    // emit preview value
}
