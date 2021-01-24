import React = require("react");
import { expression_from_vector, tweak_expression_value, vector_from_expression } from "../model/expression/expression";
import { Vector } from "../model/Vector";
import { UiInput } from "./UiInput";

let generator = 0;

export function UiVectorInput({
    value: original_value = Vector.ZERO,
    next_value = (value: Vector) => { },
    preview_value = (value: Vector) => { }
}) {
    const [suggested_value, set_suggested_value] = React.useState<string>(null)
    const [p] = React.useState(generator++)
    console.log(p,'th vector ui input instance', original_value, next_value, preview_value);
    const last_preview_str = React.useRef<string>(null)
    return <UiInput 
        value={expression_from_vector(original_value)}
        suggested_value={suggested_value}
        next_value={str => {
            next_value(vector_from_expression(str))
            set_suggested_value(null)
        }}
        preview_value={str => { 
            last_preview_str.current = str
            preview_value(vector_from_expression(str))
        }} 
        value_drag={(delta_y, cursor_at) => {
            if (last_preview_str.current === null){
                last_preview_str.current = expression_from_vector(original_value);
            }
            const tweaked = tweak_expression_value(last_preview_str.current, cursor_at, -delta_y);
            console.log(tweaked, cursor_at, delta_y)
            set_suggested_value(tweaked)
        }}/>
}