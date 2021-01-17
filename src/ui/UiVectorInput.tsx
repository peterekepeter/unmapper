import React = require("react");
import { expression_from_vector, vector_from_expression } from "../model/expression/expression";
import { Vector } from "../model/Vector";
import { UiInput } from "./UiInput";

export function UiVectorInput({
    value: original_value = Vector.ZERO,
    next_value = (value: Vector) => { },
    preview_value = (value: Vector) => { }
}) {
    return <UiInput 
        value={expression_from_vector(original_value)}
        next_value={str => next_value(vector_from_expression(str))}
        preview_value={str => preview_value(vector_from_expression(str))} />
}